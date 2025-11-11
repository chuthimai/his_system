import { SchedulesService } from '@modules/schedules/schedules.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { Transactional } from '@nestjs-cls/transactional';
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

  async findOne(
    identifier: number,
    isActive: boolean = false,
  ): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { identifier, ...(isActive ? { status: true } : {}) },
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
        if (appointment.physicianIdentifier) {
          appointment.physician = (await this.usersService.findOnePhysician(
            appointment.physicianIdentifier,
          )) as Physician;
        }

        appointment.user = (await this.usersService.findOne(
          appointment.userIdentifier,
        )) as User;
      }),
    );

    return appointments;
  }

  @Transactional()
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment | null> {
    const existedUser = await this.usersService.findOne(
      createAppointmentDto.userIdentifier,
    );
    if (!existedUser)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.USER_NOT_FOUND);

    if (createAppointmentDto.physicianIdentifier) {
      if (
        createAppointmentDto.physicianIdentifier ==
        createAppointmentDto.userIdentifier
      ) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.USER_CANNOT_BE_PHYSICIAN);
      }

      const existedPhysician = await this.usersService.findOnePhysician(
        createAppointmentDto.physicianIdentifier,
      );
      if (!existedPhysician)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
    }

    const existedWorkSchedule = await this.schedulesService.findOneWorkSchedule(
      createAppointmentDto.workScheduleIdentifier,
    );
    if (!existedWorkSchedule)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.WORK_SCHEDULE_NOT_FOUND);

    const newAppointment =
      this.appointmentRepository.create(createAppointmentDto);
    const savedAppointment =
      await this.appointmentRepository.save(newAppointment);

    const targetAppointment = await this.appointmentRepository.findOne({
      where: { identifier: savedAppointment.identifier },
      relations: ['workSchedule', 'workSchedule.shift'],
    });
    if (!targetAppointment)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_APPOINTMENT_FAIL);

    targetAppointment.user = (await this.usersService.findOne(
      targetAppointment.userIdentifier,
    )) as User;
    targetAppointment.physician = (await this.usersService.findOnePhysician(
      targetAppointment.physicianIdentifier,
    )) as Physician;

    return targetAppointment;
  }

  @Transactional()
  async delete(
    identifier: number,
    deleteAppointmentDto: DeleteAppointmentDto,
    currentUser: User,
  ): Promise<boolean> {
    let existedAppointment = await this.findOne(identifier);
    if (!existedAppointment)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.APPOINTMENT_NOT_FOUND);

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

    if (!(new Date(existedAppointment.workSchedule.date) > now))
      throw new HttpExceptionWrapper(ERROR_MESSAGES.LATE_TO_CANCEL_APPOINTMENT);

    existedAppointment = {
      ...existedAppointment,
      reason: deleteAppointmentDto.reason,
      cancellationDate: formattedDate,
      status: true,
    };

    await this.appointmentRepository.save(existedAppointment);
    return true;
  }
}
