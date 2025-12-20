import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { CurrentUser } from 'src/common/decorators/current-user.decorator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { PrescribeMedicineDto } from './dto/prescribe-medicine.dto';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN, ROLES.PATIENT)
  @Get('/')
  getAll() {
    return this.medicinesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/prescriptions')
  getAllPrescriptionsOfCurrentUser(@CurrentUser() currentUser: User) {
    return this.medicinesService.findAllPrescriptionsOfCurrentUser(currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT, ROLES.PHYSICIAN)
  @Get('/prescriptions/:prescriptionIdentifier')
  getOnePrescription(
    @Param('prescriptionIdentifier') prescriptionIdentifier: number,
  ) {
    return this.medicinesService.findOnePrescription(
      prescriptionIdentifier,
      true,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/prescriptions')
  prescribeMedicine(
    @Body() prescribeMedicineDto: PrescribeMedicineDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.medicinesService.prescribeMedicine(
      prescribeMedicineDto,
      currentUser,
    );
  }
}
