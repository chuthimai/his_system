import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { CurrentUser } from 'src/common/decorators/current-user.decorator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateLaboratoryAndImagingDto } from './dto/update-laboratory-and-imaging.dto';
import { UpdateSpecialtyConsultationDto } from './dto/update-specialty-consultation.dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/')
  getAll(@CurrentUser() currentUser: User) {
    return this.recordsService.findAll(currentUser.identifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN, ROLES.PATIENT)
  @Get('/:recordIdentifier')
  getOne(@Param('recordIdentifier') recordIdentifier: number) {
    return this.recordsService.findOneDetail(recordIdentifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post()
  create(
    @Body() createRecordDto: CreateRecordDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.create(createRecordDto, currentUser.identifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-specialty-consultation')
  updateSpecialtyConsultation(
    @Body() updateRecordDto: UpdateSpecialtyConsultationDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.updateSpecialtyConsultation(
      updateRecordDto,
      currentUser.identifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-test-and-scan')
  updateLaboratoryAndImaging(
    @Body() updateRecord2Dto: UpdateLaboratoryAndImagingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.updateLaboratoryAndImaging(
      updateRecord2Dto,
      currentUser.identifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/close/:recordIdentifier')
  close(
    @Param('recordIdentifier') recordIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.closePatientRecord(
      recordIdentifier,
      currentUser.identifier,
    );
  }
}
