import { BillingService } from '@modules/billing/billing.service';
import { HieService } from '@modules/hie/hie.service';
import { DiagnosisReport } from '@modules/reports/entities/diagnosis-report.entity';
import { ImagingReport } from '@modules/reports/entities/imaging-report.entity';
import { LaboratoryReport } from '@modules/reports/entities/laboratory-report.entity';
import { ReportsService, T } from '@modules/reports/reports.service';
import { S3Service } from '@modules/s3/s3.service';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { CloseReportQueue } from '@modules/tasks/queues/close-report.queue';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SERVICE_TYPES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/wrapper';
import { Repository } from 'typeorm';

import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateLaboratoryAndImagingDto } from './dto/update-laboratory-and-imaging.dto';
import { UpdateSpecialtyConsultationDto } from './dto/update-specialty-consultation.dto';
import { PatientRecord } from './entities/patient-record.entity';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const mapServiceTypeToEntity = new Map<string, Function>([
  [SERVICE_TYPES.GENERAL_CONSULTATION, DiagnosisReport],
  [SERVICE_TYPES.SPECIALIST_CONSULTATION, DiagnosisReport],
  [SERVICE_TYPES.LABORATORY_TEST, LaboratoryReport],
  [SERVICE_TYPES.IMAGING_SCAN, ImagingReport],
]);

@Injectable()
export class RecordsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PatientRecord)
    private readonly patientRecordRepository: Repository<PatientRecord>,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportsService: ReportsService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly schedulesService: SchedulesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
    private readonly hieService: HieService,
    @Inject(forwardRef(() => CloseReportQueue))
    private readonly closeReportQueue: CloseReportQueue,
  ) {}

  async findOne(
    identifier: number,
    isFull: boolean = false,
  ): Promise<PatientRecord | null> {
    if (!isFull) {
      return await this.patientRecordRepository.findOneBy({
        identifier,
      });
    }

    const patientRecord = await this.patientRecordRepository.findOne({
      where: { identifier },
      relations: ['serviceReports', 'serviceReports.service'],
    });
    if (!patientRecord) return patientRecord;

    patientRecord.patient = (await this.usersService.findOne(
      patientRecord.patientIdentifier,
    )) as User;

    return patientRecord;
  }

  async findOneDetail(identifier: number): Promise<any> {
    const record = await this.findOne(identifier);
    if (!record)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

    return record.status
      ? await this.findOneClosed(identifier)
      : await this.findOneUnclosed(identifier);
  }

  async findOneClosed(identifier: number): Promise<PatientRecord | null> {
    const closedRecord = await this.patientRecordRepository.findOneBy({
      identifier,
    });
    if (!closedRecord) return closedRecord;

    closedRecord.exportFileName = await this.s3Service.getSignedUrl(
      closedRecord.exportFileName,
    );

    return closedRecord;
  }

  async findOneUnclosed(identifier: number): Promise<PatientRecord | null> {
    const unclosedRecord = await this.patientRecordRepository.findOne({
      where: { identifier },
      relations: {
        serviceReports: {
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
        },
      },
    });
    if (!unclosedRecord) return unclosedRecord;

    unclosedRecord.patient = (await this.usersService.findOne(
      unclosedRecord.patientIdentifier,
    )) as User;

    unclosedRecord.serviceReports = await Promise.all(
      unclosedRecord.serviceReports.map(async (serviceReport) => {
        serviceReport.performer = (await this.usersService.findOnePhysician(
          serviceReport.performerIdentifier,
        )) as Physician;

        serviceReport.reporter = (await this.usersService.findOnePhysician(
          serviceReport.reporterIdentifier,
        )) as Physician;

        // serviceReport.service.location =
        //   (await this.schedulesService.findOneLocation(
        //     serviceReport.service.locationIdentifier,
        //   )) as unknown as Location;

        if (serviceReport.imagingReport) {
          serviceReport.imagingReport.images = await Promise.all(
            serviceReport?.imagingReport.images.map(async (image) => {
              image.endpoint = await this.s3Service.getSignedUrl(
                image.endpoint,
              );
              return image;
            }),
          );
        }

        return serviceReport;
      }),
    );

    return unclosedRecord;
  }

  async findLatestPatientRecord(
    patientIdentifier: number,
  ): Promise<PatientRecord | null> {
    return await this.patientRecordRepository.findOne({
      where: { patientIdentifier, status: false },
      order: { identifier: 'DESC' },
    });
  }

  async findAll(currentUserIdentifier: number): Promise<PatientRecord[]> {
    return await this.patientRecordRepository.find({
      where: { patientIdentifier: currentUserIdentifier },
    });
  }

  async findAllFromHie(patientIdentifier: number): Promise<any> {
    return await this.hieService.getAllRecords({
      hospitalIdentifier: this.configService.getOrThrow('HOSPITAL_IDENTIFIER'),
      patientIdentifier,
    });
  }

  @Transactional()
  async create(
    createRecordDto: CreateRecordDto,
    currentUserIdentifier: number,
  ): Promise<PatientRecord | null> {
    try {
      let patient: User | null;
      if (createRecordDto.patientIdentifier) {
        patient = await this.usersService.findOne(
          createRecordDto.patientIdentifier,
        );
        if (!patient) {
          patient = await this.usersService.create(
            {
              identifier: createRecordDto.patientIdentifier,
              ...createRecordDto,
            } as CreateUserDto,
            true,
          );
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { patientIdentifier, ...userData } = createRecordDto;
        patient = await this.usersService.create(
          userData as CreateUserDto,
          true,
        );
        if (!patient)
          throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_PATIENT_FAIL);
      }

      const newPatientRecord = this.patientRecordRepository.create({
        patientIdentifier: patient.identifier,
      });
      const savedPatientRecord =
        await this.patientRecordRepository.save(newPatientRecord);

      await this.createServiceForPatientRecord(
        currentUserIdentifier,
        currentUserIdentifier,
        currentUserIdentifier,
        savedPatientRecord.identifier,
        { type: SERVICE_TYPES.GENERAL_CONSULTATION },
        '',
      );

      return await this.findOne(savedPatientRecord.identifier, true);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_RECORD_FAIL}`,
      );
    }
  }

  @Transactional()
  async update(patientRecord: PatientRecord): Promise<PatientRecord> {
    try {
      return await this.patientRecordRepository.save(patientRecord);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_RECORD_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateSpecialtyConsultation(
    updateSpecialtyConsultationDto: UpdateSpecialtyConsultationDto,
    currentUserIdentifier: number,
  ): Promise<PatientRecord | null> {
    try {
      const existedRecord = await this.findOne(
        updateSpecialtyConsultationDto.patientRecordIdentifier,
        true,
      );
      if (!existedRecord)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
      if (existedRecord.serviceReports.length >= 2)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.SPECIALTY_CONSULTATION_SPECIFIED,
        );

      const existedStaffWorkSchedule =
        await this.schedulesService.findOneStaffWorkScheduleByCondition(
          updateSpecialtyConsultationDto.workScheduleIdentifier,
          updateSpecialtyConsultationDto.physicianIdentifier,
        );
      if (!existedStaffWorkSchedule)
        throw new HttpExceptionWrapper(
          ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
        );

      const serviceInfo = {
        type: SERVICE_TYPES.SPECIALIST_CONSULTATION,
        location: {
          identifier: existedStaffWorkSchedule.locationIdentifier,
        },
      };

      await this.createServiceForPatientRecord(
        currentUserIdentifier,
        existedStaffWorkSchedule.staffIdentifier,
        existedStaffWorkSchedule.staffIdentifier,
        updateSpecialtyConsultationDto.patientRecordIdentifier,
        serviceInfo,
        updateSpecialtyConsultationDto.request,
      );

      return await this.findOne(
        updateSpecialtyConsultationDto.patientRecordIdentifier,
        true,
      );
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_SPECIALTY_CONSULTATION_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateLaboratoryAndImaging(
    updateLaboratoryAndImagingDto: UpdateLaboratoryAndImagingDto,
    currentUserIdentifier: number,
  ): Promise<PatientRecord | null> {
    try {
      const existedRecord = await this.reportsService.findOne(
        updateLaboratoryAndImagingDto.patientRecordIdentifier,
      );
      if (!existedRecord)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

      const services = await Promise.all(
        updateLaboratoryAndImagingDto.serviceInfo.map(async (info) => {
          const service = await this.billingService.findOneService(
            info.serviceIdentifier,
          );
          if (!service)
            throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);

          return service;
        }),
      );

      await Promise.all(
        services.map(async (service, index) => {
          await this.createServiceForPatientRecord(
            currentUserIdentifier,
            null,
            null,
            updateLaboratoryAndImagingDto.patientRecordIdentifier,
            { identifier: service.identifier },
            updateLaboratoryAndImagingDto.serviceInfo[index].serviceRequest,
          );
        }),
      );

      return await this.findOne(
        updateLaboratoryAndImagingDto.patientRecordIdentifier,
        true,
      );
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_IMAGING_AND_SCAN_CONSULTATION_FAIL}`,
      );
    }
  }

  @Transactional()
  async closePatientRecord(
    identifier: number,
    currentUserIdentifier: number,
  ): Promise<void> {
    console.log('1 >>>>>>>>>>>>');
    try {
      console.log('2 >>>>>>>>>>>>');
      const existedPatientRecord = await this.findOne(identifier, true);
      console.log('3 >>>>>>>>>>>>');
      if (!existedPatientRecord)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
      console.log('4 >>>>>>>>>>>>');

      if (
        currentUserIdentifier !==
        existedPatientRecord.serviceReports[1].performerIdentifier
      ) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);
      }

      console.log('5 >>>>>>>>>>>>');

      await this.closeReportQueue.add({
        record: existedPatientRecord,
      });
      console.log('6 >>>>>>>>>>>>');
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CLOSE_RECORD_FAIL}`,
      );
    }
  }

  @Transactional()
  async createServiceForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    reporterIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceInfo: object,
    serviceRequest: string,
  ): Promise<void> {
    try {
      let invoice =
        await this.billingService.findOneInvoiceByPatientRecordIdentifier(
          patientRecordIdentifier,
        );
      if (!invoice) {
        invoice = await this.billingService.createInvoice({
          patientRecordIdentifier: patientRecordIdentifier,
        });
      }

      const service =
        await this.billingService.findOneServiceByCondition(serviceInfo);
      if (!service)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);

      await this.billingService.createInvoiceService({
        invoiceIdentifier: invoice.identifier,
        serviceIdentifier: service.identifier,
        price: service.price,
      });

      await this.createServiceReportForPatientRecord(
        requesterIdentifier,
        performerIdentifier,
        reporterIdentifier,
        patientRecordIdentifier,
        service.identifier,
        service.type,
        serviceRequest,
      );
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_SERVICE_FOR_RECORD_FAIL}`,
      );
    }
  }

  @Transactional()
  async createServiceReportForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    reporterIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceIdentifier: number,
    serviceType: string,
    serviceRequest: string,
  ): Promise<void> {
    try {
      const serviceReportEntity = mapServiceTypeToEntity.get(serviceType);
      if (!serviceReportEntity)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.ENTITY_NOT_FOUND);

      const createServiceReportInfo = {
        patientRecordIdentifier,
        serviceIdentifier,
        requesterIdentifier,
        ...(performerIdentifier ? { performerIdentifier } : {}),
        ...(reporterIdentifier ? { reporterIdentifier } : {}),
        request: serviceRequest,
      };
      await this.reportsService.createDetailServiceReport(
        serviceReportEntity as new () => T,
        createServiceReportInfo,
      );
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_REPORT_FOR_RECORD_FAIL}`,
      );
    }
  }
}
