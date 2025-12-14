import { AssessmentsService } from '@modules/assessments/assessments.service';
import { AssessmentItem } from '@modules/assessments/entities/assessment-item.entity';
import { BillingService } from '@modules/billing/billing.service';
import { MedicinesService } from '@modules/medicines/medicines.service';
import { RecordsService } from '@modules/records/records.service';
import { UpdateDiagnosisReportResultDto } from '@modules/reports/dto/update-diagnosis-report-result.dto';
import { S3Service } from '@modules/s3/s3.service';
import { Location } from '@modules/schedules/entities/location.entity';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import path from 'path';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import {
  AGE_GROUP_LABELS,
  EXPORT_PATH,
  GENDER,
  PROCESS_PATH,
  REPORT_TYPES,
  SERVICE_TYPES,
  TEMPLATE_PATH,
} from 'src/common/constants/others';
import {
  convertDataForImagingReport,
  convertDataForInitialReport,
  convertDataForLaboratoryReport,
  convertDataForSpecialReport,
  getCurrentDateTime,
} from 'src/common/helpers/converter';
import { htmlToPdf } from 'src/common/helpers/render';
import { HttpExceptionWrapper } from 'src/common/helpers/wrapper';
import { Between, In, Repository } from 'typeorm';

import { CreateImagesDto } from './dto/create-images.dto';
import { CreateServiceReportDto } from './dto/create-service-report.dto';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
import { SummaryReportsQueryDto } from './dto/summary-reports.dto';
import { UpdateImagingReportResultDto } from './dto/update-imaging-report-result.dto';
import { UpdateLaboratoryReportResultDto } from './dto/update-laboratory-report-result.dto';
import { UpdateSpecimenDto } from './dto/update-specimen.dto';
import { DiagnosisReport } from './entities/diagnosis-report.entity';
import { Image } from './entities/image.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { LaboratoryReport } from './entities/laboratory-report.entity';
import { ServiceReport } from './entities/service-report.entity';
import { Specimen } from './entities/specimen.entity';

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
    @InjectRepository(Specimen)
    private readonly specimenRepository: Repository<Specimen>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => RecordsService))
    private readonly patientRecordService: RecordsService,
    @Inject(forwardRef(() => AssessmentsService))
    private readonly assessmentsService: AssessmentsService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly schedulesService: SchedulesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MedicinesService))
    private readonly medicinesService: MedicinesService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
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

  async findOne(identifier: number): Promise<ServiceReport | null> {
    const serviceReport = await this.serviceReportRepository.findOne({
      where: { identifier },
      relations: {
        service: {
          assessmentItems: {
            measurementItem: true,
          },
        },
        assessmentResults: true,
        diagnosisReport: true,
        laboratoryReport: {
          specimens: true,
        },
        imagingReport: {
          images: true,
        },
        patientRecord: true,
      },
    });

    if (serviceReport?.patientRecord.patientIdentifier) {
      serviceReport.patientRecord.patient = (await this.usersService.findOne(
        serviceReport.patientRecord.patientIdentifier,
        false,
      )) as User;
    }

    if (serviceReport?.performerIdentifier) {
      serviceReport.performer = (await this.usersService.findOnePhysician(
        serviceReport.performerIdentifier,
      )) as Physician;
    }
    if (serviceReport?.reporterIdentifier) {
      serviceReport.reporter = (await this.usersService.findOnePhysician(
        serviceReport.reporterIdentifier,
      )) as Physician;
    }
    if (serviceReport?.requesterIdentifier) {
      serviceReport.requester = (await this.usersService.findOnePhysician(
        serviceReport.requesterIdentifier,
      )) as Physician;
    }

    if (serviceReport?.service.locationIdentifier) {
      serviceReport.service.location =
        (await this.schedulesService.findOneLocation(
          serviceReport.service.locationIdentifier,
        )) as Location;
    }
    if (serviceReport?.imagingReport?.images) {
      serviceReport.imagingReport.images = await Promise.all(
        serviceReport?.imagingReport.images.map(async (image) => {
          image.endpoint = await this.s3Service.getSignedUrl(image.endpoint);
          return image;
        }),
      );
    }

    return serviceReport;
  }

  async findOneByPatientRecordIdentifier(
    patientRecordIdentifier: number,
    currentUserIdentifier: number,
  ): Promise<ServiceReport | null> {
    const staffWorkSchedule =
      await this.schedulesService.findCurrentStaffWorkSchedule(
        currentUserIdentifier,
      );
    if (!staffWorkSchedule)
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
      );

    const existedPatientRecord = await this.patientRecordService.findOne(
      patientRecordIdentifier,
    );
    if (!existedPatientRecord)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

    const serviceReport = await this.serviceReportRepository.findOne({
      where: {
        patientRecordIdentifier,
        service: {
          locationIdentifier: staffWorkSchedule.locationIdentifier,
        },
        status: false,
      },
    });
    if (!serviceReport)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);

    return await this.findOne(serviceReport.identifier);
  }

  async findOneBySpecimenIdentifier(
    specimenIdentifier: number,
  ): Promise<ServiceReport | null> {
    const specimen = await this.findOneSpecimen(specimenIdentifier);
    if (!specimen)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SPECIMEN_NOT_FOUND);

    return this.findOne(specimen.laboratoryReportIdentifier);
  }

  async findOneSpecimen(identifier: number): Promise<Specimen | null> {
    return await this.specimenRepository.findOne({
      where: { identifier, status: false },
    });
  }

  async findAllSpecimenByServiceIdentifier(
    serviceIdentifier: number,
  ): Promise<Specimen[]> {
    return this.specimenRepository.find({
      where: serviceIdentifier
        ? { laboratoryReport: { serviceReport: { serviceIdentifier } } }
        : {},
    });
  }

  async findAllImagingReport(
    serviceIdentifier: number,
  ): Promise<ServiceReport[]> {
    const imagingReports = await this.imagingReportRepository.find({
      where: {
        serviceReport: {
          ...(serviceIdentifier
            ? { service: { identifier: serviceIdentifier } }
            : {}),
          status: false,
        },
      },
    });

    return await Promise.all(
      imagingReports.map(async (imagingReport) => {
        return (await this.findOne(imagingReport.identifier)) as ServiceReport;
      }),
    );
  }

  @Transactional()
  async create(
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<ServiceReport | null> {
    try {
      const existedService = await this.billingService.findOneService(
        createServiceReportDto.serviceIdentifier,
      );
      if (!existedService)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);

      const existedPatientRecord = await this.patientRecordService.findOne(
        createServiceReportDto.patientRecordIdentifier,
      );
      if (!existedPatientRecord)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

      let existedPerformer: Physician | null = null;
      if (createServiceReportDto.performerIdentifier) {
        existedPerformer = await this.usersService.findOnePhysician(
          createServiceReportDto.performerIdentifier,
        );
        if (!existedPerformer)
          throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }

      let existedReporter: Physician | null = null;
      if (createServiceReportDto.reporterIdentifier) {
        existedReporter = await this.usersService.findOnePhysician(
          createServiceReportDto.reporterIdentifier,
        );
        if (!existedReporter)
          throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }

      let existedRequester: Physician | null = null;
      if (createServiceReportDto.requesterIdentifier) {
        existedRequester = await this.usersService.findOnePhysician(
          createServiceReportDto.requesterIdentifier,
        );
        if (!existedRequester)
          throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
      }

      const newServiceReport = this.serviceReportRepository.create({
        ...createServiceReportDto,
      });
      return await this.serviceReportRepository.save(newServiceReport);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_REPORT_FAIL}`,
      );
    }
  }

  @Transactional()
  async createDetailServiceReport(
    entity: new () => T,
    createServiceReportDto: CreateServiceReportDto,
  ): Promise<void> {
    try {
      const detailReportRepository = this.mapEntityToRepository.get(entity);
      if (!detailReportRepository)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.ENTITY_NOT_FOUND);

      const existedService = await this.billingService.findOneService(
        createServiceReportDto.serviceIdentifier,
      );
      if (!existedService)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);

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

      const newServiceReport = (await this.create({
        ...createServiceReportDto,
      })) as ServiceReport;
      const newDetailReport = detailReportRepository.create({
        identifier: newServiceReport.identifier,
      });
      const savedDetailReport =
        await detailReportRepository.save(newDetailReport);

      if (entity === DiagnosisReport) {
        const createdServiceReport = await this.findOne(
          savedDetailReport.identifier,
        );

        (createdServiceReport as ServiceReport).effectiveTime = new Date()
          .toISOString()
          .split('T')[0];

        await this.serviceReportRepository.save(
          createdServiceReport as ServiceReport,
        );
      }
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_DETAIL_REPORT_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateDetailServiceReport(
    serviceReportIdentifier: number,
    updateDetailReportResultDto:
      | UpdateDiagnosisReportResultDto
      | UpdateLaboratoryReportResultDto
      | UpdateImagingReportResultDto,
    currentUser: User,
  ): Promise<void> {
    try {
      let serviceReport = await this.findOne(serviceReportIdentifier);
      if (!serviceReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
        );

      if (currentUser.identifier !== serviceReport.reporterIdentifier)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);

      await this.closeAllSpecimenByLaboratoryReportIdentifier(
        serviceReport.identifier,
      );

      const now = new Date();
      const dateFormatted = now
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

      const generalServiceInfo = (({ category, method, isClosed }) => ({
        category,
        method,
        recordedTime: dateFormatted,
        status: isClosed || false,
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

      const mergeIfExist = (obj: ServiceReport, key: string) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        obj[key] ? { [key]: { ...obj[key], ...detailServiceInfo } } : {};

      serviceReport = {
        ...serviceReport,
        ...generalServiceInfo,
        ...mergeIfExist(serviceReport, 'diagnosisReport'),
        ...mergeIfExist(serviceReport, 'laboratoryReport'),
        ...mergeIfExist(serviceReport, 'imagingReport'),
      };
      await this.serviceReportRepository.save(serviceReport);

      // Chưa check đẩy đủ assessment results
      await this.assessmentsService.createAssessmentResults({
        serviceReportIdentifier: serviceReport.identifier,
        assessmentResults: updateDetailReportResultDto.assessmentResults,
      });
    } catch (err) {
      console.log(err);
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_DETAIL_REPORT_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateServiceParticipant(
    serviceReportIdentifier: number,
    roleParticipant: 'performer' | 'reporter',
    currentUser: User,
  ): Promise<void> {
    try {
      const serviceReport = await this.findOne(serviceReportIdentifier);
      if (!serviceReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
        );

      if (roleParticipant === 'performer')
        serviceReport.performerIdentifier = currentUser.identifier;
      else if (roleParticipant === 'reporter')
        serviceReport.reporterIdentifier = currentUser.identifier;

      await this.serviceReportRepository.save(serviceReport);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_REPORT_PARTICIPANT_FAIL}`,
      );
    }
  }

  async checkReportPaymentStatus(
    patientRecordIdentifier: number,
    currentUserIdentifier: number,
  ): Promise<ServiceReport | null> {
    const staffWorkSchedule =
      await this.schedulesService.findCurrentStaffWorkSchedule(
        currentUserIdentifier,
      );
    if (!staffWorkSchedule)
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
      );

    const existedPatientRecord = await this.patientRecordService.findOne(
      patientRecordIdentifier,
    );
    if (!existedPatientRecord)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

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
    if (!serviceReport)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);

    serviceReport.isPaid = await this.billingService.checkServiceIsPaid(
      patientRecordIdentifier,
      serviceReport.service.identifier,
    );
    return serviceReport;
  }

  @Transactional()
  async createSpecimen(
    createSpecimenDto: CreateSpecimenDto,
    currentUser: User,
  ): Promise<Specimen | null> {
    try {
      const existedServiceReport = await this.serviceReportRepository.findOne({
        where: {
          identifier: createSpecimenDto.laboratoryReportIdentifier,
          status: false,
        },
      });
      if (!existedServiceReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.LABORATORY_REPORT_NOT_FOUND,
        );

      existedServiceReport.performerIdentifier = currentUser.identifier;
      existedServiceReport.effectiveTime = new Date()
        .toISOString()
        .split('T')[0];
      await this.serviceReportRepository.save(existedServiceReport);

      const newSpecimen = this.specimenRepository.create({
        ...createSpecimenDto,
        receivedTime: new Date()
          .toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
          .replace('T', ' '),
      });
      return await this.specimenRepository.save(newSpecimen);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_SPECIMEN_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateSpecimen(
    specimenIdentifier: number,
    updateSpecimenDto: UpdateSpecimenDto,
  ): Promise<Specimen | null> {
    try {
      const existedSpecimen = await this.findOneSpecimen(specimenIdentifier);
      if (!existedSpecimen)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.SPECIMEN_NOT_FOUND);

      const updatedSpecimen = {
        ...existedSpecimen,
        ...updateSpecimenDto,
      };
      return await this.specimenRepository.save(updatedSpecimen);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_SPECIMEN_FAIL}`,
      );
    }
  }

  @Transactional()
  async closeAllSpecimenByLaboratoryReportIdentifier(
    laboratoryReportIdentifier: number,
  ): Promise<void> {
    try {
      const specimens = await this.specimenRepository.find({
        where: {
          laboratoryReportIdentifier,
          status: false,
        },
      });

      await Promise.all(
        specimens.map(async (specimen) => {
          specimen.status = true;
          await this.specimenRepository.save(specimen);
        }),
      );
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CLOSE_SPECIMEN_FAIL}`,
      );
    }
  }

  @Transactional()
  async createImages(
    createImagesDto: CreateImagesDto,
    images: Express.Multer.File[],
    currentUser: User,
  ): Promise<Image[]> {
    try {
      const existedServiceReport = await this.serviceReportRepository.findOne({
        where: {
          identifier: createImagesDto.imagingReportIdentifier,
          status: false,
        },
      });
      if (!existedServiceReport)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.IMAGING_REPORT_NOT_FOUND);

      existedServiceReport.performerIdentifier = currentUser.identifier;
      existedServiceReport.effectiveTime = new Date()
        .toISOString()
        .split('T')[0];
      await this.serviceReportRepository.save(existedServiceReport);

      const createdImages = await Promise.all(
        images.map(async (file, i) => {
          const newName = `${createImagesDto.imagingReportIdentifier}-${Date.now()}-${i}`;
          await this.s3Service.uploadBuffer(file, newName);

          const newImage = this.imageRepository.create({
            endpoint: newName,
            receivedTime: new Date()
              .toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
              .replace('T', ' '),
            imagingReportIdentifier: createImagesDto.imagingReportIdentifier,
          });
          return await this.imageRepository.save(newImage);
        }),
      );

      return createdImages;
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_IMAGE_FAIL}`,
      );
    }
  }

  async summaryReports(
    summaryReportsDto: SummaryReportsQueryDto,
  ): Promise<Record<string, any>> {
    const { startDate, endDate, reportType } = summaryReportsDto;

    const reports = await this.serviceReportRepository.find({
      where: {
        service: {
          type: In(
            reportType === REPORT_TYPES.IMAGING
              ? [SERVICE_TYPES.IMAGING_SCAN]
              : reportType === REPORT_TYPES.LABORATORY
                ? [SERVICE_TYPES.LABORATORY_TEST]
                : [
                    SERVICE_TYPES.GENERAL_CONSULTATION,
                    SERVICE_TYPES.SPECIALIST_CONSULTATION,
                  ],
          ),
        },
        effectiveTime: Between(startDate, endDate),
      },
      relations: [
        'service',
        'patientRecord',
        'patientRecord.patient',
        'laboratoryReport',
        'laboratoryReport.specimens',
      ],
    });

    const today = new Date();

    let totalClosedReports = 0;
    let totalSpecimens = 0;
    let totalClosedSpecimens = 0;

    const patientMap = new Map<number, any>();
    const serviceGroups: Record<string, number> = {};
    const patientByDate: Record<string, Set<number>> = {};

    const ageRanges = [
      { label: AGE_GROUP_LABELS.CHILDREN, max: 12 },
      { label: AGE_GROUP_LABELS.YOUTH, max: 25 },
      { label: AGE_GROUP_LABELS.ADULTS, max: 40 },
      { label: AGE_GROUP_LABELS.MIDDLE_AGED, max: 60 },
      { label: AGE_GROUP_LABELS.SENIORS, max: Infinity },
    ];

    const ageGroups = Object.fromEntries(ageRanges.map((r) => [r.label, 0]));
    const sexGroups: Record<string, number> = {
      [GENDER.FEMALE]: 0,
      [GENDER.MALE]: 0,
    };

    for (const report of reports) {
      if (report.status) totalClosedReports++;

      // service
      const serviceName = report.service.name;
      serviceGroups[serviceName] = (serviceGroups[serviceName] ?? 0) + 1;

      // patient
      const patient = report.patientRecord.patient;
      const patientId = patient.identifier;

      // patient by date
      const dateKey = report.effectiveTime.toString().slice(0, 10);
      patientByDate[dateKey] ??= new Set();
      patientByDate[dateKey].add(patientId);

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, patient);

        const birth = new Date(patient.birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const ageGroup = ageRanges.find((r) => age <= r.max);
        if (ageGroup) ageGroups[ageGroup.label]++;

        const sex = patient.gender ? GENDER.MALE : GENDER.FEMALE;
        sexGroups[sex]++;
      }

      // laboratory
      if (reportType === 'diagnosis' && report.laboratoryReport) {
        for (const specimen of report.laboratoryReport.specimens) {
          totalSpecimens++;
          if (specimen.status) totalClosedSpecimens++;
        }
      }
    }

    const patientStatsByDate = Object.fromEntries(
      Object.entries(patientByDate).map(([date, set]) => [date, set.size]),
    );

    return {
      totalReports: reports.length,
      totalClosedReports,
      ...(reportType === REPORT_TYPES.LABORATORY && {
        totalSpecimens,
        totalClosedSpecimens,
      }),
      serviceGroups,
      totalPatient: patientMap.size,
      patientStatsByDate,
      sexGroups,
      ageGroups,
    };
  }

  async exportReport(identifier: number): Promise<string> {
    const serviceReport = await this.findOne(identifier);
    if (!serviceReport) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);
    }

    serviceReport.assessmentResults = await Promise.all(
      serviceReport.assessmentResults.map(async (assessmentResult) => {
        assessmentResult.assessmentItem =
          (await this.assessmentsService.findOneAssessmentItem(
            assessmentResult.assessmentItemIdentifier,
          )) as AssessmentItem;
        return assessmentResult;
      }),
    );

    let data: any = {},
      templateName = '',
      exportFilename = '';

    switch (serviceReport.service.type) {
      case SERVICE_TYPES.GENERAL_CONSULTATION: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForInitialReport(serviceReport);
        templateName = 'initial-report.ejs';
        exportFilename = `initial-report_${getCurrentDateTime()}.pdf`;
        break;
      }
      case SERVICE_TYPES.SPECIALIST_CONSULTATION: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForSpecialReport(serviceReport);
        templateName = 'special-report.ejs';
        exportFilename = `special-report_${getCurrentDateTime()}.pdf`;
        break;
      }
      case SERVICE_TYPES.LABORATORY_TEST: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForLaboratoryReport(serviceReport);
        templateName = 'laboratory-report.ejs';
        exportFilename = `laboratory-report_${getCurrentDateTime()}.pdf`;
        break;
      }
      case SERVICE_TYPES.IMAGING_SCAN: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForImagingReport(serviceReport);
        templateName = 'imaging-report.ejs';
        exportFilename = `imaging-report_${getCurrentDateTime()}.pdf`;
        break;
      }
      default:
        break;
    }

    exportFilename = `${serviceReport.identifier}.pdf`;

    const templatePath: string = path.resolve(
      PROCESS_PATH,
      `${TEMPLATE_PATH}${templateName}`,
    );
    const exportFilePath: string = path.resolve(
      PROCESS_PATH,
      `${EXPORT_PATH}${exportFilename}`,
    );

    await htmlToPdf(templatePath, exportFilePath, data);
    return exportFilePath;
  }
}
