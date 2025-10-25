import { AssessmentsService } from '@modules/assessments/assessments.service';
import { BillingService } from '@modules/billing/billing.service';
import {
  mapServiceTypeToEntity,
  RecordsService,
} from '@modules/records/records.service';
import { UpdateDiagnosisReportResultDto } from '@modules/reports/dto/update-diagnosis-report-result.dto';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { SERVICE_TYPES } from 'src/constants/others';
import { HttpExceptionWrapper } from 'src/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreateServiceReportDto } from './dto/create-service-report.dto';
import { UpdateImagingReportResultDto } from './dto/update-imaging-report-result.dto';
import { UpdateLaboratoryReportResultDto } from './dto/update-laboratory-report-result.dto';
import { DiagnosisReport } from './entities/diagnosis-report.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { LaboratoryReport } from './entities/laboratory-report.entity';
import { ServiceReport } from './entities/service-report.entity';

export type T = DiagnosisReport | LaboratoryReport | ImagingReport;

@Injectable()
export class ReportsService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private readonly mapEntityToRepository = new Map<Function, Repository<T>>();

  constructor(
    @InjectRepository(ServiceReport)
    private readonly serviceReportRepository: Repository<ServiceReport>,
    @InjectRepository(DiagnosisReport)
    private readonly diagnosisReportRepository: Repository<DiagnosisReport>,
    @InjectRepository(LaboratoryReport)
    private readonly laboratoryReportRepository: Repository<LaboratoryReport>,
    @InjectRepository(ImagingReport)
    private readonly imagingReportRepository: Repository<ImagingReport>,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => RecordsService))
    private readonly patientRecordService: RecordsService,
    @Inject(forwardRef(() => AssessmentsService))
    private readonly assessmentsService: AssessmentsService,
    private readonly schedulesService: SchedulesService,
    private readonly usersService: UsersService,
  ) {
    this.mapEntityToRepository.set(
      DiagnosisReport,
      this.diagnosisReportRepository,
    );
    this.mapEntityToRepository.set(
      LaboratoryReport,
      this.laboratoryReportRepository,
    );
    this.mapEntityToRepository.set(ImagingReport, this.imagingReportRepository);
  }

  async findOne(identifier: number): Promise<T | null> {
    const serviceReport = await this.serviceReportRepository.findOne({
      where: { identifier, status: false },
      relations: ['diagnosisReport', 'imagingReport', 'laboratoryReport'],
    });

    return serviceReport?.diagnosisReport
      ? await this.findOneDetailServiceReport(DiagnosisReport, identifier)
      : serviceReport?.laboratoryReport
        ? await this.findOneDetailServiceReport(LaboratoryReport, identifier)
        : await this.findOneDetailServiceReport(ImagingReport, identifier);
  }

  async findOneDetailServiceReport(
    entity: new () => T,
    identifier: number,
  ): Promise<T | null> {
    const detailReportRepository = this.mapEntityToRepository.get(entity);
    if (!detailReportRepository) {
      throw new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND);
    }

    const detailServiceReport = await detailReportRepository.findOne({
      where: { identifier, serviceReport: { status: false } },
      relations: ['serviceReport', 'serviceReport.service'],
    });
    if (!detailServiceReport) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
      );
    }

    detailServiceReport.serviceReport.service.assessmentItems =
      await this.assessmentsService.findAllAssessmentItems(
        detailServiceReport.serviceReport.service.identifier,
      );
    if (detailServiceReport?.serviceReport.performerIdentifier) {
      detailServiceReport.serviceReport.performer =
        (await this.usersService.findOnePhysician(
          detailServiceReport?.serviceReport.performerIdentifier,
        )) as Physician;
    }
    if (detailServiceReport?.serviceReport.reporterIdentifier) {
      detailServiceReport.serviceReport.reporter =
        (await this.usersService.findOnePhysician(
          detailServiceReport?.serviceReport.reporterIdentifier,
          false,
        )) as Physician;
    }
    if (detailServiceReport?.serviceReport.requesterIdentifier) {
      detailServiceReport.serviceReport.requester =
        (await this.usersService.findOnePhysician(
          detailServiceReport?.serviceReport.requesterIdentifier,
        )) as Physician;
    }
    return detailServiceReport;
  }

  async findOneByPatientRecordIdentifier(
    patientRecordIdentifier: number,
    currentUserIdentifier: number,
  ): Promise<T | null> {
    const staffWorkSchedule =
      await this.schedulesService.findCurrentStaffWorkSchedule(
        currentUserIdentifier,
      );
    if (!staffWorkSchedule) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
      );
    }

    const existedPatientRecord =
      await this.patientRecordService.findOnePatientRecord(
        patientRecordIdentifier,
      );
    if (!existedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const serviceReport = await this.serviceReportRepository.findOne({
      where: {
        patientRecordIdentifier,
        service: {
          locationIdentifier: staffWorkSchedule.locationIdentifier,
        },
        status: false,
      },
      relations: ['service'],
    });
    if (!serviceReport) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);
    }

    const entity = mapServiceTypeToEntity.get(serviceReport.service.type);
    if (!entity) {
      throw new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND);
    }

    const detailServiceReport = await this.findOneDetailServiceReport(
      entity as new () => T,
      serviceReport.identifier,
    );

    (detailServiceReport as unknown as ServiceReport).isPaid =
      await this.billingService.checkServiceIsPaid(
        serviceReport.patientRecordIdentifier,
        serviceReport.serviceIdentifier,
      );

    return detailServiceReport;
  }

  async create(
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<ServiceReport | null> {
    const existedService = await this.billingService.findOneService(
      createServiceReportDto.serviceIdentifier,
    );
    if (!existedService) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    const existedPatientRecord =
      await this.patientRecordService.findOnePatientRecord(
        createServiceReportDto.patientRecordIdentifier,
      );
    if (!existedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    let existedPerformer: Physician | null = null;
    if (createServiceReportDto.performerIdentifier) {
      existedPerformer = await this.usersService.findOnePhysician(
        createServiceReportDto.performerIdentifier,
      );
      if (!existedPerformer) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }
    }

    let existedReporter: Physician | null = null;
    if (createServiceReportDto.reporterIdentifier) {
      existedReporter = await this.usersService.findOnePhysician(
        createServiceReportDto.reporterIdentifier,
      );
      if (!existedReporter) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }
    }

    let existedRequester: Physician | null = null;
    if (createServiceReportDto.requesterIdentifier) {
      existedRequester = await this.usersService.findOnePhysician(
        createServiceReportDto.requesterIdentifier,
      );
      if (!existedRequester) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }
    }

    const newServiceReport = this.serviceReportRepository.create({
      ...createServiceReportDto,
    });
    return await this.serviceReportRepository.save(newServiceReport);
  }

  async createDetailServiceReport(
    entity: new () => T,
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<T | null> {
    const detailReportRepository = this.mapEntityToRepository.get(entity);
    if (!detailReportRepository) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.ENTITY_NOT_FOUND);
    }

    const existedService = await this.billingService.findOneService(
      createServiceReportDto.serviceIdentifier,
    );
    if (!existedService) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    if (!createServiceReportDto.requesterIdentifier) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.REQUESTER_PHYSICIAN_MUST_BE_SPECIFY,
      );
    }
    if (
      [
        SERVICE_TYPES.GENERAL_CONSULTATION,
        SERVICE_TYPES.SPECIALIST_CONSULTATION,
      ].includes(existedService.type) &&
      !createServiceReportDto.performerIdentifier
    ) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.PERFORMER_PHYSICIAN_MUST_BE_SPECIFY,
      );
    }

    const newServiceReport = await this.create({
      ...createServiceReportDto,
    });
    if (!newServiceReport) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_SERVICE_REPORT_FAIL);
    }

    const newDetailReport = detailReportRepository.create({
      identifier: newServiceReport.identifier,
    });
    const savedDetailReport =
      await detailReportRepository.save(newDetailReport);

    return await detailReportRepository.findOne({
      where: { identifier: savedDetailReport.identifier },
      relations: ['serviceReport'],
    });
  }

  async update(newDetailReport: ServiceReport): Promise<ServiceReport> {
    return newDetailReport?.diagnosisReport
      ? await this.diagnosisReportRepository.save(newDetailReport)
      : newDetailReport?.laboratoryReport
        ? await this.laboratoryReportRepository.save(newDetailReport)
        : await this.imagingReportRepository.save(newDetailReport);
  }

  async updateDetailServiceReport(
    updateDetailReportResultDto:
      | UpdateDiagnosisReportResultDto
      | UpdateLaboratoryReportResultDto
      | UpdateImagingReportResultDto,
    currentUser: User,
  ): Promise<boolean> {
    let detailReport = await this.findOne(
      updateDetailReportResultDto.serviceReportIdentifier,
    );
    if (!detailReport) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
      );
    }

    if (
      currentUser.identifier !== detailReport.serviceReport.performerIdentifier
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);
    }

    // Chưa check đẩy đủ assessment results

    const assessmentResultsCreated =
      await this.assessmentsService.createAssessmentResults({
        serviceReportIdentifier: detailReport.identifier,
        assessmentResults: updateDetailReportResultDto.assessmentResults,
      });
    if (!assessmentResultsCreated) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.CREATE_ASSESSMENT_RESULT_FAIL,
      );
    }

    const date = new Date(0);
    const dateFormatted = date.toISOString().replace('T', ' ').substring(0, 19);

    const generalServiceInfo = (({ category, method, effectiveTime }) => ({
      category,
      method,
      effectiveTime,
      recordedTime: dateFormatted,
      status: true,
    }))(updateDetailReportResultDto);
    const detailServiceInfo =
      updateDetailReportResultDto instanceof UpdateDiagnosisReportResultDto
        ? {
            severity: updateDetailReportResultDto.severity,
            conclusion: updateDetailReportResultDto.conclusion,
          }
        : {
            interpretation: updateDetailReportResultDto.interpretation,
            ...(updateDetailReportResultDto instanceof
            UpdateImagingReportResultDto
              ? { focus: updateDetailReportResultDto.focus }
              : {}),
          };

    detailReport = {
      ...detailReport,
      ...detailServiceInfo,
      serviceReport: {
        ...detailReport.serviceReport,
        ...generalServiceInfo,
      },
    };

    const detailReportUpdated = await this.update(
      detailReport as unknown as ServiceReport,
    );
    return detailReportUpdated ? true : false;
  }

  async updateServiceParticipant(
    serviceReportIdentifier: number,
    roleParticipant: 'performer' | 'reporter',
    currentUser: User,
  ): Promise<boolean> {
    const detailReport = await this.findOne(serviceReportIdentifier);
    if (!detailReport) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
      );
    }

    if (roleParticipant === 'performer')
      detailReport.serviceReport.performerIdentifier = currentUser.identifier;
    else if (roleParticipant === 'reporter')
      detailReport.serviceReport.reporterIdentifier = currentUser.identifier;

    const detailReportUpdated = await this.update(
      detailReport as unknown as ServiceReport,
    );
    return detailReportUpdated ? true : false;
  }
}
