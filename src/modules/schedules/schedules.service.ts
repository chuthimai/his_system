import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { In, Repository } from 'typeorm';
import { ShiftConditionDto } from './dto/get-shifts-by-condition.dto';
import { Shift } from './entities/shift.entity';
import { DUTIES } from 'src/constants/others';
import { WorkScheduleConditionDto } from './dto/get-work-schedules-by-condition.dto';
import { UsersService } from '@modules/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { StaffWorkSchedule } from './entities/staff-work-schedule.entity';
import { StaffWorkScheduleConditionDto } from './dto/get-staff-work-schedules-by-condition.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(WorkSchedule)
    private readonly workScheduleRepository: Repository<WorkSchedule>,
    @InjectRepository(StaffWorkSchedule)
    private readonly staffWorkScheduleRepository: Repository<StaffWorkSchedule>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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

    const queryBuilder = this.workScheduleRepository
      .createQueryBuilder('workSchedule')
      .select('MIN(workSchedule.identifier)', 'identifier')
      .addSelect('workSchedule.date', 'date')
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
      .groupBy('workSchedule.date');

    const identifiers = (await queryBuilder.getRawMany()).map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      (workSchedule) => workSchedule.identifier,
    );

    const workSchedules = await this.workScheduleRepository.findBy({
      identifier: In(identifiers),
    });

    return workSchedules;
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

    const staffWorkSchedules = await this.staffWorkScheduleRepository.find({
      where: {
        staffIdentifier: staffWorkScheduleConditionDto.physicianIdentifier,
        active: true,
      },
      relations: [
        'workSchedule',
        'workSchedule.location',
        'workSchedule.shift',
        'staff',
      ],
    });

    const updatedStaffWorkSchedules = await Promise.all(
      staffWorkSchedules.map(async (staffWorkSchedule) => {
        const location = await this.findOneLocation(
          staffWorkSchedule.workSchedule.location.identifier,
        );

        staffWorkSchedule.workSchedule.location = location as Location;
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
