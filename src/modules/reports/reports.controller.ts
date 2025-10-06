import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/decorators/current-user.decorator.dto';
import { User } from '@modules/users/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/others';
import { UpdateDiagnosisReportResultDto } from './dto/update-diagnosis-report-result.dto';
import { UpdateLaboratoryReportResultDto } from './dto/update-imaging-report-result.dto';
import { UpdateImagingReportResultDto } from './dto/update-laboratoty-report-result.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/:patientRecordIdentifier')
  async getCurrentOneByPatientRecordIdentifier(
    @Param('patientRecordIdentifier') patientRecordIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return await this.reportService.findOneByPatientRecordIdentifier(
      patientRecordIdentifier,
      currentUser.identifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-diagnosis-report-result')
  async updateDiagnosisReportResult(
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
  async updateLaboratoryReportResult(
    @Body() updateLaboratoryReportResultDto: UpdateLaboratoryReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    // TODO
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-imaging-report-result')
  async updateImagingReportResult(
    @Body() updateImagingReportResultDto: UpdateImagingReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    // TODO
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/close-service-report/:serviceReportIdentifier')
  async closeServiceReport(
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
  async getOne(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
  ) {
    return await this.reportService.findOne(serviceReportIdentifier);
  }
}
