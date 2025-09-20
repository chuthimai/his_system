import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { SchedulesService } from '@modules/schedules/schedules.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly schedulesService: SchedulesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const existedUser = await this.usersService.findOne(
      createAppointmentDto.userIdentifier,
    );

    const existedPhysician = await this.usersService.findOnePhysician(
      createAppointmentDto.physicianIdentifier,
    );

    const existedWorkSchedule = await this.schedulesService.findOneWorkSchedule(
      createAppointmentDto.workScheduleIdentifier,
    );

    if (!existedUser || !existedPhysician || !existedWorkSchedule) {
      throw !existedUser
        ? new HttpException(
            ERROR_MESSAGES.USER_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
          )
        : !existedPhysician
          ? new HttpException(
              ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
              HttpStatus.BAD_REQUEST,
            )
          : new HttpException(
              ERROR_MESSAGES.WORK_SCHEDULE_NOT_FOUND,
              HttpStatus.BAD_REQUEST,
            );
    }

    const newAppointment =
      this.appointmentRepository.create(createAppointmentDto);

    const savedAppointment =
      await this.appointmentRepository.save(newAppointment);

    const targetAppointment = (await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.user', 'user')
      .leftJoinAndSelect('appointment.workSchedule', 'workSchedule')
      .leftJoinAndSelect('workSchedule.shift', 'shift')
      .addSelect([
        'user.name',
        'user.telecom',
        'user.birth_date',
        'user.gender',
        'user.address',
      ])
      .where('appointment.identifier = :id', {
        id: savedAppointment.identifier,
      })
      .getOne()) as Appointment;

    targetAppointment.physician = (await this.usersService.findOnePhysician(
      targetAppointment.physicianIdentifier,
      false,
    )) as Physician;

    return targetAppointment;
  }
}
