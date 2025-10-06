import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceReport } from './entities/service-report.entity';
import { Repository } from 'typeorm';
import { CreateServiceReportDto } from './dto/create-service-report.dto';
import { BillingService } from '@modules/billing/billing.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { UsersService } from '@modules/users/users.service';
import { Physician } from '@modules/users/entities/physician.entity';
import {
  mapServiceTypeToEntity,
  RecordsService,
} from '@modules/records/records.service';
import { DiagnosisReport } from './entities/diagnosis-report.entity';
import { LaboratoryReport } from './entities/laboratory-report.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { SERVICE_TYPES } from 'src/constants/others';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { UpdateDiagnosisReportResultDto } from '@modules/reports/dto/update-diagnosis-report-result.dto';
import { AssessmentsService } from '@modules/assessments/assessments.service';
import { User } from '@modules/users/entities/user.entity';

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
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RecordsService))
    private readonly patientRecordService: RecordsService,
    private readonly schedulesService: SchedulesService,
    private readonly assessmentsService: AssessmentsService,
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

    return serviceReport?.laboratoryReport
      ? await this.findOneDetailServiceReport(LaboratoryReport, identifier)
      : serviceReport?.imagingReport
        ? await this.findOneDetailServiceReport(ImagingReport, identifier)
        : await this.findOneDetailServiceReport(DiagnosisReport, identifier);
  }

  // For get service report in findOneByPatientRecordIdentifier function here
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
    if (!detailServiceReport) return null;

    detailServiceReport.serviceReport.service.assessmentItems =
      await this.assessmentsService.findAllAssessmentItems(
        detailServiceReport.serviceReport.service.identifier,
      );
    if (detailServiceReport?.serviceReport.performerIdentifier) {
      detailServiceReport.serviceReport.performer =
        (await this.usersService.findOnePhysician(
          detailServiceReport?.serviceReport.performerIdentifier,
          false,
        )) as Physician;
    }
    if (detailServiceReport?.serviceReport.requesterIdentifier) {
      detailServiceReport.serviceReport.requester =
        (await this.usersService.findOnePhysician(
          detailServiceReport?.serviceReport.requesterIdentifier,
          false,
        )) as Physician;
    }
    return detailServiceReport;
  }

  async findOneByPatientRecordIdentifier(
    patientRecordIdentifier: number,
    currentUserIdentifier: number,
  ) {
    const staffWorkSchedule =
      await this.schedulesService.findCurrentStaffWorkSchedule(
        currentUserIdentifier,
      );
    if (!staffWorkSchedule) {
      throw new HttpException(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existedPatientRecord =
      await this.patientRecordService.findOnePatientRecord(
        patientRecordIdentifier,
      );
    if (!existedPatientRecord) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = mapServiceTypeToEntity.get(serviceReport.service.type);
    if (!entity) {
      throw new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND);
    }
    return await this.findOneDetailServiceReport(
      entity as new () => T,
      serviceReport.identifier,
    );
  }

  // For create service report in createDetailServiceReport function here
  async create(
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<ServiceReport | null> {
    const existedService = await this.billingService.findOneService(
      createServiceReportDto.serviceIdentifier,
    );
    if (!existedService) {
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existedPatientRecord =
      await this.patientRecordService.findOnePatientRecord(
        createServiceReportDto.patientRecordIdentifier,
      );
    if (!existedPatientRecord) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    let existedPerformer: Physician | null = null;
    if (createServiceReportDto.performerIdentifier) {
      existedPerformer = await this.usersService.findOnePhysician(
        createServiceReportDto.performerIdentifier,
      );
      if (!existedPerformer) {
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    let existedRequester: Physician | null = null;
    if (createServiceReportDto.requesterIdentifier) {
      existedRequester = await this.usersService.findOnePhysician(
        createServiceReportDto.requesterIdentifier,
      );
      if (!existedRequester) {
        throw new HttpException(
          ERROR_MESSAGES.PHYSICIAN_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newServiceReport = this.serviceReportRepository.create({
      ...createServiceReportDto,
    });
    return await this.serviceReportRepository.save(newServiceReport);
  }

  // For create service report in createServiceReportForPatientRecord in records/create-or-update
  async createDetailServiceReport(
    entity: new () => T,
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<T | null> {
    const detailReportRepository = this.mapEntityToRepository.get(entity);
    if (!detailReportRepository) {
      throw new HttpException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existedService = await this.billingService.findOneService(
      createServiceReportDto.serviceIdentifier,
    );
    if (!existedService) {
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!createServiceReportDto.requesterIdentifier) {
      throw new HttpException(
        ERROR_MESSAGES.REQUESTER_PHYSICIAN_MUST_BE_SPECIFY,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      [
        SERVICE_TYPES.GENERAL_CONSULTATION,
        SERVICE_TYPES.SPECIALIST_CONSULTATION,
      ].includes(existedService.type) &&
      !createServiceReportDto.performerIdentifier
    ) {
      throw new HttpException(
        ERROR_MESSAGES.PERFORMER_PHYSICIAN_MUST_BE_SPECIFY,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newServiceReport = await this.create({
      ...createServiceReportDto,
    });
    if (!newServiceReport) {
      throw new HttpException(
        ERROR_MESSAGES.CREATE_SERVICE_REPORT_FAIL,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newDetailReport = detailReportRepository.create({
      identifier: newServiceReport.identifier,
    });
    if (!newDetailReport) {
      throw new HttpException(
        ERROR_MESSAGES.CREATE_DETAIL_SERVICE_REPORT_FAIL,
        HttpStatus.BAD_REQUEST,
      );
    }
    const savedDetailReport =
      await detailReportRepository.save(newDetailReport);

    return await detailReportRepository.findOne({
      where: { identifier: savedDetailReport.identifier },
      relations: ['serviceReport'],
    });
  }

  async updateDiagnosisReportResult(
    updateDiagnosisReportResultDto: UpdateDiagnosisReportResultDto,
    currentUser: User,
  ) {
    let diagnosisReport = (await this.findOneDetailServiceReport(
      DiagnosisReport,
      updateDiagnosisReportResultDto.serviceReportIdentifier,
    )) as DiagnosisReport;
    if (!diagnosisReport) {
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      currentUser.identifier !==
      diagnosisReport.serviceReport.performerIdentifier
    ) {
      throw new HttpException(
        ERROR_MESSAGES.PERMISSION_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    // Chưa check đẩy đủ assessment results

    const assessmentResultsCreated =
      await this.assessmentsService.createAssessmentResults({
        serviceReportIdentifier: diagnosisReport.identifier,
        assessmentResults: updateDiagnosisReportResultDto.assessmentResults,
      });
    if (!assessmentResultsCreated) {
      throw new Error(ERROR_MESSAGES.CREATE_ASSESSMENT_RESULT_FAIL);
    }

    const date = new Date(0);
    const dateFormatted = date.toISOString().replace('T', ' ').substring(0, 19);
    diagnosisReport = {
      ...diagnosisReport,
      serviceReport: {
        ...diagnosisReport.serviceReport,
        ...(({ category, method, effectiveTime }) => ({
          category,
          method,
          effectiveTime,
          updateDiagnosisReportResultDto,
        }))(updateDiagnosisReportResultDto),
        recordedTime: dateFormatted,
      },
      ...(({ severity, conclusion }) => ({ severity, conclusion }))(
        updateDiagnosisReportResultDto,
      ),
    };

    const diagnosisReportUpdated =
      await this.diagnosisReportRepository.save(diagnosisReport);
    return diagnosisReportUpdated ? true : false;
  }

  async closeServiceReport(serviceReportIdentifier: number, currentUser: User) {
    const detailServiceReport = (await this.findOne(
      serviceReportIdentifier,
    )) as T;
    if (!detailServiceReport) {
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      currentUser.identifier !==
      detailServiceReport.serviceReport.performerIdentifier
    ) {
      throw new HttpException(
        ERROR_MESSAGES.PERMISSION_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    detailServiceReport.serviceReport.status = true;
    const closedServiceReport = await this.serviceReportRepository.save(
      detailServiceReport.serviceReport,
    );
    return closedServiceReport ? true : false;
  }
}
