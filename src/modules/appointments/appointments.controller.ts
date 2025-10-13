import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { ROLES } from 'src/constants/others';
import { RolesGuard } from 'src/guards/roles.guard';

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
