import { SpecializationsService } from '@modules/specializations/specializations.service';
import { Staff } from '@modules/users/entities/staff.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { DUTIES } from 'src/constants/others';
import { HttpExceptionWrapper } from 'src/helpers/http-exception-wrapper';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { StaffWorkScheduleConditionDto } from './dto/staff-work-schedules-by-condition.dto';
import { WorkScheduleConditionDto } from './dto/work-schedules-by-condition.dto';
import { Location } from './entities/location.entity';
import { StaffWorkSchedule } from './entities/staff-work-schedule.entity';
import { WorkSchedule } from './entities/work-schedule.entity';

export class SchedulesService {
  constructor(
    @InjectRepository(WorkSchedule)
    private readonly workScheduleRepository: Repository<WorkSchedule>,
    @InjectRepository(StaffWorkSchedule)
    private readonly staffWorkScheduleRepository: Repository<StaffWorkSchedule>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly specializationsService: SpecializationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // For check existence in appointments/create (just check existence)
  async findOneWorkSchedule(identifier: number): Promise<WorkSchedule | null> {
    return await this.workScheduleRepository.findOne({
      where: { identifier },
    });
  }

  // For check existence in records/update (just check existence)
  async findOneStaffWorkSchedule(
    identifier: number,
  ): Promise<StaffWorkSchedule | null> {
    return await this.staffWorkScheduleRepository.findOne({
      where: { identifier, active: true },
    });
  }

  // For check existence, fetch base info in records/update (base info)
  async findOneStaffWorkScheduleByCondition(
    workScheduleIdentifier: number,
    staffIdentifier: number,
  ): Promise<StaffWorkSchedule | null> {
    return await this.staffWorkScheduleRepository.findOne({
      where: { workScheduleIdentifier, staffIdentifier, active: true },
    });
  }

  async findOneLocation(identifier: number) {
    const childLocation = (await this.locationRepository.findOneBy({
      identifier,
    })) as Location;

    if (!childLocation) return null;

    let fullName = childLocation.name;
    let nextLocation: Location | null = { ...childLocation };
    while (nextLocation.parentIdentifier) {
      nextLocation = await this.locationRepository.findOneBy({
        identifier: nextLocation.parentIdentifier,
      });

      if (!nextLocation) break;
      fullName = `${fullName}, ${nextLocation.name}`;
    }

    return { ...childLocation, name: fullName };
  }

  // Must have information: base, shifts
  async findAllWorkSchedulesByCondition(
    workScheduleConditionDto: WorkScheduleConditionDto,
  ): Promise<WorkSchedule[]> {
    if (workScheduleConditionDto.physicianIdentifier) {
      const existedPhysician = await this.usersService.findOnePhysician(
        workScheduleConditionDto?.physicianIdentifier,
      );

      if (!existedPhysician) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }
    }

    // Get work schedules from today to the end of next month
    const today = new Date();
    const endMonthNext = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return await this.workScheduleRepository
      .createQueryBuilder('workSchedule')
      .select('workSchedule')
      .where('workSchedule.date BETWEEN :today AND :endMonthNext', {
        today: formatDate(today),
        endMonthNext: formatDate(endMonthNext),
      })
      .innerJoin(
        'workSchedule.staffWorkSchedules',
        'staffWorkSchedule',
        'staffWorkSchedule.duty = :duty ' +
          'AND staffWorkSchedule.active = :active',
        { duty: DUTIES.SPECIALIST_EXAMINATION, active: true },
      )
      .innerJoin(
        'staffWorkSchedule.staff',
        'staff',
        workScheduleConditionDto.physicianIdentifier
          ? 'staff.identifier = :identifier'
          : '1=1',
        {
          identifier: workScheduleConditionDto.physicianIdentifier,
        },
      )
      .innerJoinAndSelect(
        'workSchedule.shift',
        'shift',
        'shift.name <> :name',
        {
          name: 'Trực',
        },
      )
      .getMany();
  }

  // Must have information: base, duty, workSchedule, shift, location, staff
  async findAllStaffWorkSchedulesByCondition(
    staffWorkScheduleConditionDto: StaffWorkScheduleConditionDto,
  ): Promise<StaffWorkSchedule[]> {
    return staffWorkScheduleConditionDto.physicianIdentifier
      ? await this.findAllStaffWorkSchedulesByPhysicianIdentifier(
          staffWorkScheduleConditionDto.physicianIdentifier,
        )
      : await this.findAllStaffWorkSchedulesBySpecialtyIdentifier(
          staffWorkScheduleConditionDto.specialtyIdentifier!,
        );
  }

  async findAllStaffWorkSchedulesByPhysicianIdentifier(
    physicianIdentifier: number,
  ): Promise<StaffWorkSchedule[]> {
    const existedPhysician =
      await this.usersService.findOnePhysician(physicianIdentifier);

    if (!existedPhysician) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
    }

    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth());
    const lastDayNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 2,
      0,
      23,
      59,
      59,
    );

    const staffWorkSchedules = await this.staffWorkScheduleRepository
      .createQueryBuilder('staffWorkSchedule')
      .where('staffWorkSchedule.staffIdentifier = :staffIdentifier', {
        staffIdentifier: physicianIdentifier,
      })
      .innerJoinAndSelect(
        'staffWorkSchedule.workSchedule',
        'workSchedule',
        'staffWorkSchedule.active = :active',
        { active: true },
      )
      .innerJoinAndSelect(
        'workSchedule.shift',
        'shift',
        `ADDTIME(workSchedule.date, shift.endTime) >= :firstDayCurrentMonth AND 
        ADDTIME(workSchedule.date, shift.startTime) <= :lastDayNextMonth`,
        {
          firstDayCurrentMonth,
          lastDayNextMonth,
        },
      )
      .innerJoinAndSelect('staffWorkSchedule.location', 'location')
      .innerJoinAndSelect('staffWorkSchedule.staff', 'staff')
      .innerJoinAndSelect('staff.user', 'user')
      .getMany();

    const updatedStaffWorkSchedules = await Promise.all(
      staffWorkSchedules.map(async (staffWorkSchedule) => {
        const location = await this.findOneLocation(
          staffWorkSchedule.location.identifier,
        );

        staffWorkSchedule.location = location as Location;
        staffWorkSchedule.staff = {
          identifier: staffWorkSchedule.staff.identifier,
          name: staffWorkSchedule.staff.user.name,
        } as Staff;
        return staffWorkSchedule;
      }),
    );

    return updatedStaffWorkSchedules;
  }

  async findAllStaffWorkSchedulesBySpecialtyIdentifier(
    specialtyIdentifier: number,
  ): Promise<StaffWorkSchedule[]> {
    const existedSpecialty =
      await this.specializationsService.findOne(specialtyIdentifier);

    if (!existedSpecialty)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SPECIALTY_NOT_FOUND);

    const now = new Date();
    const nowPlus30Minutes = new Date(now.getTime() + 30 * 60000);
    const endOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      23,
      59,
      59,
    );

    const staffWorkSchedules = await this.staffWorkScheduleRepository
      .createQueryBuilder('staffWorkSchedule')
      .innerJoinAndSelect(
        'staffWorkSchedule.workSchedule',
        'workSchedule',
        'staffWorkSchedule.active = :active',
        { active: true },
      )
      .innerJoinAndSelect(
        'workSchedule.shift',
        'shift',
        `ADDTIME(workSchedule.date, shift.endTime) >= :nowPlus30Minutes AND 
        ADDTIME(workSchedule.date, shift.endTime) <= :endOfTomorrow`,
        {
          nowPlus30Minutes,
          endOfTomorrow,
        },
      )
      .innerJoinAndSelect('staffWorkSchedule.location', 'location')
      .innerJoinAndSelect('staffWorkSchedule.staff', 'staff')
      .innerJoin(
        'staff.physician',
        'physician',
        'physician.specialtyIdentifier = :specialtyIdentifier',
        {
          specialtyIdentifier,
        },
      )
      .innerJoinAndSelect('staff.user', 'user')
      .getMany();

    const updatedStaffWorkSchedules = await Promise.all(
      staffWorkSchedules.map(async (staffWorkSchedule) => {
        const location = await this.findOneLocation(
          staffWorkSchedule.location.identifier,
        );

        staffWorkSchedule.location = location as Location;
        staffWorkSchedule.staff = {
          identifier: staffWorkSchedule.staff.identifier,
          name: staffWorkSchedule.staff.user.name,
        } as Staff;
        return staffWorkSchedule;
      }),
    );

    return updatedStaffWorkSchedules;
  }

  async findCurrentStaffWorkSchedule(currentUserIdentifier: number) {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 8);

    // const currentDate = '2025-10-13';
    // const currentTime = '11:20:20';

    return await this.staffWorkScheduleRepository.findOne({
      where: {
        staffIdentifier: currentUserIdentifier,
        workSchedule: {
          date: currentDate,
          shift: {
            startTime: LessThanOrEqual(currentTime),
            endTime: MoreThanOrEqual(currentTime),
          },
        },
      },
      relations: ['workSchedule'],
    });
  }
}
