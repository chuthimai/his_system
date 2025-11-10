import { BillingService } from '@modules/billing/billing.service';
import { Service } from '@modules/billing/entities/service.entity';
import { MedicinesService } from '@modules/medicines/medicines.service';
import { DiagnosisReport } from '@modules/reports/entities/diagnosis-report.entity';
import { ImagingReport } from '@modules/reports/entities/imaging-report.entity';
import { LaboratoryReport } from '@modules/reports/entities/laboratory-report.entity';
import { ReportsService, T } from '@modules/reports/reports.service';
import { S3Service } from '@modules/s3/s3.service';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import {
  EXPORT_PATH,
  PROCESS_PATH,
  SERVICE_TYPES,
} from 'src/common/constants/others';
import { mergePdfs } from 'src/common/files/utils/render';
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
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MedicinesService))
    private readonly medicinesService: MedicinesService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  async findOne(
    identifier: number,
    isFull: boolean = false,
  ): Promise<PatientRecord | null> {
    return !isFull
      ? await this.patientRecordRepository.findOneBy({
          identifier,
        })
      : await this.patientRecordRepository
          .createQueryBuilder('record')
          .where('record.identifier = :identifier', {
            identifier,
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
            'serviceReports.performerIdentifier',
          ])
          .leftJoin('serviceReports.service', 'service')
          .addSelect(['service.identifier', 'service.type', 'service.name'])
          .getOne();
  }

  async findOneDetail(identifier: number): Promise<any> {
    const record = await this.findOne(identifier);
    if (!record) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    return record.status
      ? await this.findOneClosedRecords(identifier)
      : await this.findOneUnclosedRecords(identifier);
  }

  async findOneClosedRecords(
    identifier: number,
  ): Promise<PatientRecord | null> {
    const closedRecord = await this.patientRecordRepository.findOne({
      where: { identifier },
    });

    if (!closedRecord) return closedRecord;

    closedRecord.exportFileName = await this.s3Service.getSignedUrl(
      closedRecord.exportFileName,
    );
    return closedRecord;
  }

  async findOneUnclosedRecords(
    identifier: number,
  ): Promise<PatientRecord | null> {
    const unclosedRecord = await this.patientRecordRepository.findOne({
      where: { identifier },
      relations: [
        'serviceReports',
        'serviceReports.service',
        'serviceReports.service.assessmentItems',
        'serviceReports.assessmentResults',
      ],
      order: {
        serviceReports: {
          service: {
            identifier: 'ASC',
          },
        },
      },
    });

    if (!unclosedRecord) return unclosedRecord;

    unclosedRecord.serviceReports = await Promise.all(
      unclosedRecord.serviceReports.map(async (serviceReport) => {
        serviceReport.performer = (await this.usersService.findOnePhysician(
          serviceReport.performerIdentifier,
        )) as Physician;

        serviceReport.reporter = (await this.usersService.findOnePhysician(
          serviceReport.reporterIdentifier,
        )) as Physician;

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

  async findAll(currentUser: User): Promise<PatientRecord[]> {
    return await this.patientRecordRepository.find({
      where: { patientIdentifier: currentUser.identifier },
    });
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
        '',
      ))
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
    }

    return await this.findOne(savedPatientRecord.identifier, true);
  }

  async updateSpecialtyConsultation(
    updateSpecialtyConsultationDto: UpdateSpecialtyConsultationDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.findOne(
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
        updateSpecialtyConsultationDto.request,
      ))
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
    }

    return await this.findOne(
      updateSpecialtyConsultationDto.patientRecordIdentifier,
      true,
    );
  }

  async updateLaboratoryAndImaging(
    updateLaboratoryAndImagingDto: UpdateLaboratoryAndImagingDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.reportsService.findOne(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
    );
    if (!existedRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const services = await Promise.all(
      updateLaboratoryAndImagingDto.serviceInfo.map(async (info) => {
        const service = await this.billingService.findOneService(
          info.serviceIdentifier,
        );
        if (!service) {
          throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
        }
        return service;
      }),
    );

    await Promise.all(
      services.map(async (service, index) => {
        if (
          !(await this.createServiceForPatientRecord(
            currentUser.identifier,
            null,
            null,
            updateLaboratoryAndImagingDto.patientRecordIdentifier,
            { identifier: service.identifier },
            updateLaboratoryAndImagingDto.serviceInfo[index].serviceRequest,
          ))
        ) {
          throw new HttpExceptionWrapper(ERROR_MESSAGES.UNEXPECTABLE_FAULT);
        }
      }),
    );

    return await this.findOne(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
      true,
    );
  }

  async updatePatientRecord(
    patientRecord: PatientRecord,
  ): Promise<PatientRecord> {
    return await this.patientRecordRepository.save(patientRecord);
  }

  async closePatientRecord(
    identifier: number,
    currentUser: User,
  ): Promise<boolean> {
    const existedPatientRecord = await this.findOne(identifier, true);
    if (!existedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    if (
      currentUser.identifier !==
      existedPatientRecord.serviceReports[1].performerIdentifier
    ) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);
    }

    const exportFilePaths: string[] = [];
    for (const serviceReport of existedPatientRecord.serviceReports) {
      exportFilePaths.push(
        await this.reportsService.exportReport(serviceReport.identifier),
      );
    }
    exportFilePaths.push(
      await this.medicinesService.exportPrescription(
        existedPatientRecord.prescriptionIdentifier,
      ),
    );

    const now = new Date();
    const yyyyMMdd = now.toISOString().slice(0, 10).replace(/-/g, '');

    const exportFileName = `record_${existedPatientRecord.identifier}_${yyyyMMdd}.pdf`;
    const exportFilePath: string = path.resolve(
      PROCESS_PATH,
      `${EXPORT_PATH}${exportFileName}`,
    );
    await mergePdfs(exportFilePaths, exportFilePath);

    await this.s3Service.uploadFile(
      exportFilePath,
      exportFileName,
      'application/pdf',
    );

    existedPatientRecord.status = true;
    existedPatientRecord.exportFileName = exportFileName;
    const updatedPatientRecord =
      await this.updatePatientRecord(existedPatientRecord);

    return updatedPatientRecord ? true : false;
  }

  async createServiceForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    reporterIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceInfo: object,
    serviceRequest: string,
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
      serviceRequest,
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
    serviceRequest: string,
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
      request: serviceRequest,
    };
    const serviceReport = await this.reportsService.createDetailServiceReport(
      serviceReportEntity as new () => T,
      createServiceReportInfo,
    );
    return serviceReport ? true : false;
  }
}
