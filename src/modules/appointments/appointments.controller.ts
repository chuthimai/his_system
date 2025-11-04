import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { CurrentUser } from 'src/common/decorators/current-user.decorator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DeleteAppointmentDto } from './dto/delete-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN, ROLES.PATIENT)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN, ROLES.PATIENT)
  @Delete('/:appointmentIdentifier')
  delete(
    @Param('appointmentIdentifier') appointmentIdentifier: number,
    @Body() deleteAppointmentDto: DeleteAppointmentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.delete(
      appointmentIdentifier,
      deleteAppointmentDto,
      currentUser,
    );
  }
}
