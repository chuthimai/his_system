import { AssessmentsService } from '@modules/assessments/assessments.service';
import { AssessmentItem } from '@modules/assessments/entities/assessment-item.entity';
import { BillingService } from '@modules/billing/billing.service';
import { MedicinesService } from '@modules/medicines/medicines.service';
import {
  mapServiceTypeToEntity,
  RecordsService,
} from '@modules/records/records.service';
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
  EXPORT_PATH,
  PROCESS_PATH,
  SERVICE_TYPES,
  TEMPLATE_PATH,
} from 'src/common/constants/others';
import {
  convertDataForImagingReport,
  convertDataForInitialReport,
  convertDataForLaboratoryReport,
  convertDataForSpecialReport,
} from 'src/common/files/utils/converter';
import { htmlToPdf } from 'src/common/files/utils/render';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreateImagesDto } from './dto/create-images.dto';
import { CreateServiceReportDto } from './dto/create-service-report.dto';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
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

  async findOne(identifier: number): Promise<T | null> {
    const serviceReport = await this.serviceReportRepository.findOne({
      where: { identifier },
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
    if (!detailReportRepository)
      throw new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND);

    const detailServiceReport = await detailReportRepository.findOne({
      where: { identifier },
      relations: [
        'serviceReport',
        'serviceReport.service',
        'serviceReport.service.assessmentItems',
        'serviceReport.assessmentResults',
        'serviceReport.patientRecord',
        'serviceReport.patientRecord.patient',
        ...(entity === LaboratoryReport ? ['specimens'] : []),
        ...(entity === ImagingReport ? ['images'] : []),
      ],
      order: {
        serviceReport: {
          assessmentResults: {
            assessmentItemIdentifier: 'ASC',
          },
        },
      },
    });
    if (!detailServiceReport)
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
      );

    detailServiceReport.serviceReport.patientRecord.patient =
      (await this.usersService.findOne(
        detailServiceReport.serviceReport.patientRecord.patientIdentifier,
        false,
      )) as User;

    detailServiceReport.serviceReport.service.location =
      (await this.schedulesService.findOneLocation(
        detailServiceReport.serviceReport.service.locationIdentifier,
      )) as Location;

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

    if (
      entity === ImagingReport &&
      (detailServiceReport as ImagingReport).images.length > 0
    ) {
      await Promise.all(
        (detailServiceReport as ImagingReport).images.map(async (image) => {
          image.endpoint = await this.s3Service.getSignedUrl(image.endpoint);
        }),
      );
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

    const entity = mapServiceTypeToEntity.get(serviceReport.service.type);
    if (!entity) throw new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND);

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

  async findOneBySpecimenIdentifier(
    specimenIdentifier: number,
  ): Promise<T | null> {
    const specimen = await this.findOneSpecimen(specimenIdentifier);
    if (!specimen)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SPECIMEN_NOT_FOUND);

    return this.findOneDetailServiceReport(
      LaboratoryReport,
      specimen.laboratoryReportIdentifier,
    );
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
  ): Promise<ImagingReport[]> {
    const imagingReports = await this.imagingReportRepository.find({
      where: {
        serviceReport: {
          ...(serviceIdentifier
            ? { service: { identifier: serviceIdentifier } }
            : {}),
          status: false,
        },
      },
      relations: [
        'serviceReport',
        'serviceReport.service',
        'serviceReport.service.assessmentItems',
        'images',
      ],
    });

    await Promise.all(
      imagingReports.map(async (imagingReport) => {
        imagingReport.serviceReport.performer =
          (await this.usersService.findOnePhysician(
            imagingReport.serviceReport.performerIdentifier,
          )) as Physician;
      }),
    );

    return imagingReports;
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
        const createdDetailReport = await this.findOneDetailServiceReport(
          DiagnosisReport,
          savedDetailReport.identifier,
        );

        (createdDetailReport as DiagnosisReport).serviceReport.effectiveTime =
          new Date().toISOString().split('T')[0];

        await detailReportRepository.save(createdDetailReport as unknown as T);
      }
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_DETAIL_REPORT_FAIL}`,
      );
    }
  }

  @Transactional()
  async update(newDetailReport: T): Promise<T> {
    try {
      return (newDetailReport as DiagnosisReport).severity
        ? await this.diagnosisReportRepository.save(newDetailReport)
        : (newDetailReport as LaboratoryReport).specimens
          ? await this.laboratoryReportRepository.save(newDetailReport)
          : await this.imagingReportRepository.save(newDetailReport);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_REPORT_FAIL}`,
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
      let detailReport = await this.findOne(serviceReportIdentifier);
      if (!detailReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
        );

      if (
        currentUser.identifier !== detailReport.serviceReport.reporterIdentifier
      )
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);

      await this.closeAllSpecimenByLaboratoryReportIdentifier(
        detailReport.identifier,
      );

      // Chưa check đẩy đủ assessment results

      await this.assessmentsService.createAssessmentResults({
        serviceReportIdentifier: detailReport.identifier,
        assessmentResults: updateDetailReportResultDto.assessmentResults,
      });

      const now = new Date();
      const dateFormatted = now.toISOString().split('T')[0];

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

      detailReport = {
        ...detailReport,
        ...detailServiceInfo,
        serviceReport: {
          ...detailReport.serviceReport,
          ...generalServiceInfo,
        },
      };
      await this.update(detailReport);
    } catch (err) {
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
      const detailReport = await this.findOne(serviceReportIdentifier);
      if (!detailReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.DETAIL_SERVICE_REPORT_NOT_FOUND,
        );

      if (roleParticipant === 'performer')
        detailReport.serviceReport.performerIdentifier = currentUser.identifier;
      else if (roleParticipant === 'reporter')
        detailReport.serviceReport.reporterIdentifier = currentUser.identifier;

      await this.update(detailReport);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_REPORT_PARTICIPANT_FAIL}`,
      );
    }
  }

  @Transactional()
  async createSpecimen(
    createSpecimenDto: CreateSpecimenDto,
    currentUser: User,
  ): Promise<Specimen | null> {
    try {
      const existedLaboratoryReport =
        await this.laboratoryReportRepository.findOne({
          where: {
            identifier: createSpecimenDto.laboratoryReportIdentifier,
            serviceReport: { status: false },
          },
          relations: ['serviceReport'],
        });
      if (!existedLaboratoryReport)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.LABORATORY_REPORT_NOT_FOUND,
        );

      existedLaboratoryReport.serviceReport.performerIdentifier =
        currentUser.identifier;
      existedLaboratoryReport.serviceReport.effectiveTime = new Date()
        .toISOString()
        .split('T')[0];
      await this.laboratoryReportRepository.save(existedLaboratoryReport);

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
      const existedImagingReport = await this.imagingReportRepository.findOne({
        where: {
          identifier: createImagesDto.imagingReportIdentifier,
          serviceReport: { status: false },
        },
        relations: ['serviceReport'],
      });
      if (!existedImagingReport)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.IMAGING_REPORT_NOT_FOUND);

      existedImagingReport.serviceReport.performerIdentifier =
        currentUser.identifier;
      existedImagingReport.serviceReport.effectiveTime = new Date()
        .toISOString()
        .split('T')[0];
      await this.imagingReportRepository.save(existedImagingReport);

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

  async exportReport(identifier: number): Promise<string> {
    const detailReport = await this.findOne(identifier);
    if (!detailReport) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);
    }

    detailReport.serviceReport.assessmentResults = await Promise.all(
      detailReport.serviceReport.assessmentResults.map(
        async (assessmentResult) => {
          assessmentResult.assessmentItem =
            (await this.assessmentsService.findOneAssessmentItem(
              assessmentResult.assessmentItemIdentifier,
            )) as AssessmentItem;
          return assessmentResult;
        },
      ),
    );

    // console.dir(detailReport, { depth: null, colors: true });

    let data: any = {},
      templateName = '',
      exportFilename = '';

    switch (detailReport.serviceReport.service.type) {
      case SERVICE_TYPES.GENERAL_CONSULTATION: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForInitialReport(detailReport as DiagnosisReport);
        templateName = 'initial-report.ejs';
        exportFilename = 'initial-diagnosis.pdf';
        break;
      }
      case SERVICE_TYPES.SPECIALIST_CONSULTATION: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForSpecialReport(detailReport as DiagnosisReport);
        templateName = 'special-report.ejs';
        exportFilename = 'special-diagnosis.pdf';
        break;
      }
      case SERVICE_TYPES.LABORATORY_TEST: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForLaboratoryReport(detailReport as LaboratoryReport);
        templateName = 'laboratory-report.ejs';
        exportFilename = 'laboratory-diagnosis.pdf';
        break;
      }
      case SERVICE_TYPES.IMAGING_SCAN: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data = convertDataForImagingReport(detailReport as ImagingReport);
        templateName = 'imaging-report.ejs';
        exportFilename = 'imaging-diagnosis.pdf';
        break;
      }
      default:
        break;
    }

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
