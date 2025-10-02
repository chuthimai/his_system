import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { Repository } from 'typeorm';
import { ShiftConditionDto } from './dto/get-shifts-by-condition.dto';
import { Shift } from './entities/shift.entity';
import { DUTIES } from 'src/constants/others';
import { WorkScheduleConditionDto } from './dto/get-work-schedules-by-condition.dto';
import { UsersService } from '@modules/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { StaffWorkSchedule } from './entities/staff-work-schedule.entity';
import { StaffWorkScheduleConditionDto } from './dto/get-staff-work-schedules-by-condition.dto';
import { Location } from './entities/location.entity';
import { Staff } from '@modules/users/entities/staff.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(WorkSchedule)
    private readonly workScheduleRepository: Repository<WorkSchedule>,
    @InjectRepository(StaffWorkSchedule)
    private readonly staffWorkScheduleRepository: Repository<StaffWorkSchedule>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly usersService: UsersService,
  ) {}

  async findOneWorkSchedule(identifier: number) {
    return await this.workScheduleRepository.findOne({
      where: { identifier },
    });
  }

  async findAllWorkSchedulesByCondition(
    workScheduleConditionDto: WorkScheduleConditionDto,
  ) {
    if (workScheduleConditionDto.physicianIdentifier) {
      const existedPhysician = await this.usersService.findOnePhysician(
        workScheduleConditionDto?.physicianIdentifier,
      );

      if (!existedPhysician)
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
    }

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
      .innerJoinAndSelect('workSchedule.shift', 'shift')
      .getMany();
  }

  async findAllStaffWorkSchedulesByCondition(
    staffWorkScheduleConditionDto: StaffWorkScheduleConditionDto,
  ) {
    if (staffWorkScheduleConditionDto.physicianIdentifier) {
      const existedPhysician = await this.usersService.findOnePhysician(
        staffWorkScheduleConditionDto?.physicianIdentifier,
      );

      if (!existedPhysician)
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
    }

    const now = new Date();
    const thirtyMinLater = new Date(now.getTime() + 30 * 60000);

    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 999);

    const staffWorkSchedules = await this.staffWorkScheduleRepository
      .createQueryBuilder('staffWorkSchedule')
      .where(
        staffWorkScheduleConditionDto.physicianIdentifier
          ? 'staffWorkSchedule.staffIdentifier = :staffIdentifier'
          : '1=1',
        { staffIdentifier: staffWorkScheduleConditionDto.physicianIdentifier },
      )
      .innerJoinAndSelect(
        'staffWorkSchedule.workSchedule',
        'workSchedule',
        'staffWorkSchedule.active = :active',
        { active: true },
      )
      .innerJoinAndSelect(
        'workSchedule.shift',
        'shift',
        `ADDTIME(workSchedule.date, shift.end_time) >= :thirtyMinLater AND 
        ADDTIME(workSchedule.date, shift.end_time) <= :end`,
        { thirtyMinLater, end },
      )
      .innerJoinAndSelect('staffWorkSchedule.location', 'location')
      .innerJoinAndSelect(
        'staffWorkSchedule.staff',
        'staff',
        staffWorkScheduleConditionDto.specialtyIdentifier
          ? 'staff.physician.specialtyIdentifier = :specialtyIdentifier'
          : '1=1',
        {
          specialtyIdentifier:
            staffWorkScheduleConditionDto.specialtyIdentifier,
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

  async findAllShiftsByCondition(shiftConditionDto: ShiftConditionDto) {
    if (shiftConditionDto.physicianIdentifier) {
      const existedPhysician = await this.usersService.findOnePhysician(
        shiftConditionDto?.physicianIdentifier,
      );

      if (!existedPhysician)
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
    }

    return await this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoin(
        'shift.workSchedules',
        'workSchedule',
        'workSchedule.date = :date',
        { date: shiftConditionDto.date },
      )
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
        shiftConditionDto.physicianIdentifier
          ? 'staff.identifier = :identifier'
          : '1=1',
        {
          identifier: shiftConditionDto.physicianIdentifier,
        },
      )
      .getMany();
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
}
