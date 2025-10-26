import { BillingService } from '@modules/billing/billing.service';
import { Service } from '@modules/billing/entities/service.entity';
import { DiagnosisReport } from '@modules/reports/entities/diagnosis-report.entity';
import { ImagingReport } from '@modules/reports/entities/imaging-report.entity';
import { LaboratoryReport } from '@modules/reports/entities/laboratory-report.entity';
import { ReportsService, T } from '@modules/reports/reports.service';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SERVICE_TYPES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
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
    @InjectRepository(PatientRecord)
    private readonly patientRecordRepository: Repository<PatientRecord>,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportsService: ReportsService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly schedulesService: SchedulesService,
    private readonly usersService: UsersService,
  ) {}

  async findOnePatientRecord(
    patientRecordIdentifier: number,
    isFull: boolean = false,
  ): Promise<PatientRecord | null> {
    return !isFull
      ? await this.patientRecordRepository.findOneBy({
          identifier: patientRecordIdentifier,
        })
      : await this.patientRecordRepository
          .createQueryBuilder('record')
          .where('record.identifier = :identifier', {
            identifier: patientRecordIdentifier,
          })
          .leftJoin('record.patient', 'patient')
          .addSelect([
            'patient.identifier',
            'patient.name',
            'patient.telecom',
            'patient.birthDate',
            'patient.gender',
            'patient.address',
          ])
          .leftJoin('record.serviceReports', 'serviceReports')
          .addSelect([
            'serviceReports.identifier',
            'serviceReports.serviceIdentifier',
          ])
          .leftJoin('serviceReports.service', 'service')
          .addSelect(['service.identifier', 'service.type', 'service.name'])
          .addSelect([])
          .getOne();
  }

  async create(
    createRecordDto: CreateRecordDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    let patient: User | null;
    if (createRecordDto.patientIdentifier) {
      patient = await this.usersService.findOne(
        createRecordDto.patientIdentifier,
      );
      if (!patient) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_NOT_FOUND);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { patientIdentifier, ...userData } = createRecordDto;
      patient = await this.usersService.create(userData as CreateUserDto, true);
      if (!patient) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_PATIENT_FAIL);
      }
    }

    const newPatientRecord = this.patientRecordRepository.create({
      patientIdentifier: patient.identifier,
    });
    const savedPatientRecord =
      await this.patientRecordRepository.save(newPatientRecord);
    if (!savedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_PATIENT_RECORD_FAIL);
    }

    if (
      !(await this.createServiceForPatientRecord(
        currentUser.identifier,
        currentUser.identifier,
        currentUser.identifier,
        savedPatientRecord.identifier,
        { type: SERVICE_TYPES.GENERAL_CONSULTATION },
      ))
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
    }

    return await this.findOnePatientRecord(savedPatientRecord.identifier, true);
  }

  async updateSpecialtyConsultation(
    updateSpecialtyConsultationDto: UpdateSpecialtyConsultationDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.findOnePatientRecord(
      updateSpecialtyConsultationDto.patientRecordIdentifier,
      true,
    );
    if (!existedRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    } else if (existedRecord.serviceReports.length >= 2) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.SPECIALTY_CONSULTATION_SPECIFIED,
      );
    }

    const existedStaffWorkSchedule =
      await this.schedulesService.findOneStaffWorkScheduleByCondition(
        updateSpecialtyConsultationDto.workScheduleIdentifier,
        updateSpecialtyConsultationDto.physicianIdentifier,
      );
    if (!existedStaffWorkSchedule) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
      );
    }

    const serviceInfo = {
      type: SERVICE_TYPES.SPECIALIST_CONSULTATION,
      location: {
        identifier: existedStaffWorkSchedule.locationIdentifier,
      },
    };

    if (
      !(await this.createServiceForPatientRecord(
        currentUser.identifier,
        existedStaffWorkSchedule.staffIdentifier,
        existedStaffWorkSchedule.staffIdentifier,
        updateSpecialtyConsultationDto.patientRecordIdentifier,
        serviceInfo,
      ))
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
    }

    return await this.findOnePatientRecord(
      updateSpecialtyConsultationDto.patientRecordIdentifier,
      true,
    );
  }

  async updateLaboratoryAndImaging(
    updateLaboratoryAndImagingDto: UpdateLaboratoryAndImagingDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.findOnePatientRecord(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
    );
    if (!existedRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const services = await Promise.all(
      updateLaboratoryAndImagingDto.serviceIdentifiers.map(
        async (serviceIdentifier) => {
          const service =
            await this.billingService.findOneService(serviceIdentifier);
          if (!service) {
            throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
          }
          return service;
        },
      ),
    );

    await Promise.all(
      services.map(async (service) => {
        if (
          !(await this.createServiceForPatientRecord(
            currentUser.identifier,
            null,
            null,
            updateLaboratoryAndImagingDto.patientRecordIdentifier,
            { identifier: service.identifier },
          ))
        ) {
          throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
        }
      }),
    );

    return await this.findOnePatientRecord(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
      true,
    );
  }

  async updatePatientRecord(
    patientRecord: PatientRecord,
  ): Promise<PatientRecord> {
    return await this.patientRecordRepository.save(patientRecord);
  }

  async createServiceForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    reporterIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceInfo: object,
  ): Promise<boolean> {
    let invoice =
      await this.billingService.findOneInvoiceByPatientRecordIdentifier(
        patientRecordIdentifier,
      );
    if (!invoice) {
      invoice = await this.billingService.createInvoice({
        patientRecordIdentifier: patientRecordIdentifier,
      });
      if (!invoice) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_INVOICE_FAIL);
      }
    }

    const service = (await this.billingService.findOneServiceByCondition(
      serviceInfo,
    )) as Service;
    if (!service) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    const serviceInvoiceCreated =
      await this.billingService.createInvoiceService({
        invoiceIdentifier: invoice.identifier,
        serviceIdentifier: service.identifier,
      });
    if (!serviceInvoiceCreated) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.CREATE_INVOICE_SERVICE_FAIL,
      );
    }

    const serviceReportCreated = await this.createServiceReportForPatientRecord(
      requesterIdentifier,
      performerIdentifier,
      reporterIdentifier,
      patientRecordIdentifier,
      service.identifier,
      service.type,
    );
    return serviceReportCreated ? true : false;
  }

  async createServiceReportForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    reporterIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceIdentifier: number,
    serviceType: string,
  ): Promise<boolean> {
    const serviceReportEntity = mapServiceTypeToEntity.get(serviceType);
    if (!serviceReportEntity) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.ENTITY_NOT_FOUND);
    }

    const createServiceReportInfo = {
      patientRecordIdentifier,
      serviceIdentifier,
      requesterIdentifier,
      ...(performerIdentifier ? { performerIdentifier } : {}),
      ...(reporterIdentifier ? { reporterIdentifier } : {}),
    };
    const serviceReport = await this.reportsService.createDetailServiceReport(
      serviceReportEntity as new () => T,
      createServiceReportInfo,
    );
    return serviceReport ? true : false;
  }
}
