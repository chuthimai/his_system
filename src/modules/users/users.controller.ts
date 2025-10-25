import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/by-name')
  findAllByName(@Query('name') name: string) {
    return this.usersService.findAllByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/by-patient-record-identifier/:patientRecordIdentifier')
  getOneByPatientRecordIdentifier(
    @Param('patientRecordIdentifier') patientRecordIdentifier: number,
  ) {
    return this.usersService.findOneByPatientRecordIdentifier(
      patientRecordIdentifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/physicians-by-specialty/:specialtyIdentifier')
  getPhysicianBySpecialty(
    @Param('specialtyIdentifier') specialtyIdentifier: number,
  ) {
    return this.usersService.findAllPhysicianBySpecialty(specialtyIdentifier);
  }
}
