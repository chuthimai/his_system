import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/constants/others';
import { CurrentUser } from 'src/decorators/current-user.decorator.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

import { UpdateDiagnosisReportResultDto } from './dto/update-diagnosis-report-result.dto';
import { UpdateLaboratoryReportResultDto } from './dto/update-imaging-report-result.dto';
import { UpdateImagingReportResultDto } from './dto/update-laboratoty-report-result.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/:patientRecordIdentifier')
  getCurrentOneByPatientRecordIdentifier(
    @Param('patientRecordIdentifier') patientRecordIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.findOneByPatientRecordIdentifier(
      patientRecordIdentifier,
      currentUser.identifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-diagnosis-report-result')
  updateDiagnosisReportResult(
    @Body() updateDiagnosisReportResultDto: UpdateDiagnosisReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateDiagnosisReportResult(
      updateDiagnosisReportResultDto,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-laboratory-report-result')
  updateLaboratoryReportResult(
    @Body() updateLaboratoryReportResultDto: UpdateLaboratoryReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    // TODO
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-imaging-report-result')
  updateImagingReportResult(
    @Body() updateImagingReportResultDto: UpdateImagingReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    // TODO
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/close-service-report/:serviceReportIdentifier')
  closeServiceReport(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.closeServiceReport(
      serviceReportIdentifier,
      currentUser,
    );
  }

  // !!! FOR TESTING PURPOSE ONLY !!!
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/test/:serviceReportIdentifier')
  getOne(@Param('serviceReportIdentifier') serviceReportIdentifier: number) {
    return this.reportService.findOne(serviceReportIdentifier);
  }
}
