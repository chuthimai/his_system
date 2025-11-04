import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  @Roles(ROLES.PHYSICIAN)
  @Get('/')
  getAll() {
    return this.medicinesService.findAll();
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
