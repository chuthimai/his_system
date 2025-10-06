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

  // Must have information: base, workSchedule, physician, user
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const existedUser = await this.usersService.findOne(
      createAppointmentDto.userIdentifier,
    );

    const existedWorkSchedule = await this.schedulesService.findOneWorkSchedule(
      createAppointmentDto.workScheduleIdentifier,
    );

    if (!existedUser || !existedWorkSchedule) {
      throw !existedUser
        ? new HttpException(
            ERROR_MESSAGES.USER_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
          )
        : new HttpException(
            ERROR_MESSAGES.WORK_SCHEDULE_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
          );
    }

    if (createAppointmentDto.physicianIdentifier) {
      if (
        createAppointmentDto.physicianIdentifier ==
        createAppointmentDto.userIdentifier
      ) {
        throw new HttpException(
          ERROR_MESSAGES.APPOINTMENT_USER_CANNOT_BE_PHYSICIAN,
          HttpStatus.BAD_REQUEST,
        );
      }

      const existedPhysician = await this.usersService.findOnePhysician(
        createAppointmentDto.physicianIdentifier,
      );

      if (!existedPhysician) {
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newAppointment =
      this.appointmentRepository.create(createAppointmentDto);

    const savedAppointment =
      await this.appointmentRepository.save(newAppointment);

    const targetAppointment = (await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.identifier = :identifier', {
        identifier: savedAppointment.identifier,
      })
      .leftJoinAndSelect('appointment.workSchedule', 'workSchedule')
      .leftJoinAndSelect('workSchedule.shift', 'shift')
      .leftJoin('appointment.user', 'user')
      .addSelect([
        'user.identifier',
        'user.name',
        'user.telecom',
        'user.birthDate',
        'user.gender',
        'user.address',
      ])
      .getOne()) as Appointment;

    targetAppointment.physician = (await this.usersService.findOnePhysician(
      targetAppointment.physicianIdentifier,
      false,
    )) as Physician;

    return targetAppointment;
  }
}
