import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/constants/others';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('/by-user')
  getAllByUserIdentifier(@Query('userIdentifier') userIdentifier: number) {
    return this.appointmentsService.findAllByUserIdentifier(userIdentifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN, ROLES.PATIENT)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }
}
