import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { CurrentUser } from 'src/common/decorators/current-user.decorator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { CreateImagesDto } from './dto/create-images.dto';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
import { UpdateDiagnosisReportResultDto } from './dto/update-diagnosis-report-result.dto';
import { UpdateImagingReportResultDto } from './dto/update-imaging-report-result.dto';
import { UpdateLaboratoryReportResultDto } from './dto/update-laboratory-report-result.dto';
import { UpdateSpecimenDto } from './dto/update-specimen.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/specimens')
  getAllSpecimensByServiceIdentifier(
    @Query('serviceIdentifier') serviceIdentifier: number,
  ) {
    return this.reportService.findAllSpecimenByServiceIdentifier(
      serviceIdentifier,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/specimens')
  createSpecimen(
    @Body() createSpecimenDto: CreateSpecimenDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.createSpecimen(createSpecimenDto, currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/specimens/:specimenIdentifier')
  updateSpecimen(
    @Param('specimenIdentifier') specimenIdentifier: number,
    @Body() updateSpecimenDto: UpdateSpecimenDto,
  ) {
    return this.reportService.updateSpecimen(
      specimenIdentifier,
      updateSpecimenDto,
    );
  }

  @UseInterceptors(ImageUploadInterceptor('images'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/images')
  createImage(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createImagesDto: CreateImagesDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.createImages(
      createImagesDto,
      images,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/imaging-reports')
  getAllImagingReport(@Query('serviceIdentifier') serviceIdentifier: number) {
    return this.reportService.findAllImagingReport(serviceIdentifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/by-specimen-identifier/:specimenIdentifier')
  getOneBySpecimenIdentifier(
    @Param('specimenIdentifier') specimenIdentifier: number,
  ) {
    return this.reportService.findOneBySpecimenIdentifier(specimenIdentifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/by-patient-record-identifier/:patientRecordIdentifier')
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
  @Get('/by-service-report-identifier/:serviceReportIdentifier')
  getOne(@Param('serviceReportIdentifier') serviceReportIdentifier: number) {
    return this.reportService.findOne(serviceReportIdentifier);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-diagnosis-report-result/:serviceReportIdentifier')
  updateDiagnosisReportResult(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @Body() updateDiagnosisReportResultDto: UpdateDiagnosisReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateDetailServiceReport(
      serviceReportIdentifier,
      updateDiagnosisReportResultDto,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-laboratory-report-result/:serviceReportIdentifier')
  updateLaboratoryReportResult(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @Body() updateLaboratoryReportResultDto: UpdateLaboratoryReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateDetailServiceReport(
      serviceReportIdentifier,
      updateLaboratoryReportResultDto,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-imaging-report-result/:serviceReportIdentifier')
  updateImagingReportResult(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @Body() updateImagingReportResultDto: UpdateImagingReportResultDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateDetailServiceReport(
      serviceReportIdentifier,
      updateImagingReportResultDto,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-performer-physician/:serviceReportIdentifier')
  updatePerformerPhysician(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateServiceParticipant(
      serviceReportIdentifier,
      'performer',
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-reporter-physician/:serviceReportIdentifier')
  updateReporterPhysician(
    @Param('serviceReportIdentifier') serviceReportIdentifier: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.updateServiceParticipant(
      serviceReportIdentifier,
      'reporter',
      currentUser,
    );
  }
}
