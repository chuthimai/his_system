import { SchedulesService } from '@modules/schedules/schedules.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DeleteAppointmentDto } from './dto/delete-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly schedulesService: SchedulesService,
  ) {}

  async findOne(identifier: number): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { identifier, status: false },
      relations: ['workSchedule'],
    });
  }

  async findAllByUserIdentifier(
    userIdentifier: number,
  ): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: { ...(userIdentifier ? { userIdentifier } : {}), status: true },
      relations: ['workSchedule', 'workSchedule.shift'],
    });

    await Promise.all(
      appointments.map(async (appointment) => {
        appointment.physician = (await this.usersService.findOnePhysician(
          appointment.physicianIdentifier,
        )) as unknown as Physician;
        appointment.user = (await this.usersService.findOne(
          appointment.userIdentifier,
        )) as User;
      }),
    );

    return appointments;
  }

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
        ? new HttpExceptionWrapper(ERROR_MESSAGES.USER_NOT_FOUND)
        : new HttpExceptionWrapper(ERROR_MESSAGES.WORK_SCHEDULE_NOT_FOUND);
    }

    if (createAppointmentDto.physicianIdentifier) {
      if (
        createAppointmentDto.physicianIdentifier ==
        createAppointmentDto.userIdentifier
      ) {
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.APPOINTMENT_USER_CANNOT_BE_PHYSICIAN,
        );
      }

      const existedPhysician = await this.usersService.findOnePhysician(
        createAppointmentDto.physicianIdentifier,
      );
      if (!existedPhysician) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
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
    )) as Physician;

    return targetAppointment;
  }

  async delete(
    identifier: number,
    deleteAppointmentDto: DeleteAppointmentDto,
    currentUser: User,
  ): Promise<boolean> {
    let existedAppointment = await this.findOne(identifier);
    if (!existedAppointment) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.APPOINTMENT_NOT_FOUND);
    }

    if (
      ![
        existedAppointment.physicianIdentifier,
        existedAppointment.userIdentifier,
      ].includes(currentUser.identifier)
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);
    }

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    // Consider
    if (!(new Date(existedAppointment.workSchedule.date) > now)) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.CAN_NOT_CANCEL_APPOINTMENT);
    }

    existedAppointment = {
      ...existedAppointment,
      reason: deleteAppointmentDto.reason,
      cancellationDate: formattedDate,
      status: true,
    };

    const cancelAppointment =
      await this.appointmentRepository.save(existedAppointment);
    return cancelAppointment ? true : false;
  }
}
