import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { BillingService } from '@modules/billing/billing.service';
import { SERVICE_NAMES, SERVICE_TYPES } from 'src/constants/others';
import { Service } from '@modules/billing/entities/service.entity';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { ReportsService, T } from '@modules/reports/reports.service';
import { DiagnosisReport } from '@modules/reports/entities/diagnosis-report.entity';
import { LaboratoryReport } from '@modules/reports/entities/laboratory-report.entity';
import { ImagingReport } from '@modules/reports/entities/imaging-report.entity';
import { UpdateSpecialtyConsultationDto } from './dto/update-specialty-consultation.dto';
import { UpdateLaboratoryAndImagingDto } from './dto/update-laboratory-and-imaging.dto';

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
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    private readonly schedulesService: SchedulesService,
    private readonly reportsService: ReportsService,
  ) {}

  // For check existence in createInvoice in billing service
  async findOnePatientRecord(
    patientRecordIdentifier: number,
    isFull: boolean = false,
  ) {
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

  // Must have information: base, patient
  async create(
    createRecordDto: CreateRecordDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    let patient: User | null;
    if (createRecordDto.patientIdentifier) {
      patient = await this.usersService.findOne(
        createRecordDto.patientIdentifier,
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { patientIdentifier, ...userData } = createRecordDto;
      patient = await this.usersService.create(userData as CreateUserDto, true);
    }
    if (!patient) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPatientRecord = this.patientRecordRepository.create({
      patientIdentifier: patient.identifier,
    });
    const savedPatientRecord =
      await this.patientRecordRepository.save(newPatientRecord);

    if (
      !(await this.createServiceForPatientRecord(
        currentUser.identifier,
        currentUser.identifier,
        savedPatientRecord.identifier,
        { type: SERVICE_TYPES.GENERAL_CONSULTATION },
      ))
    ) {
      throw new HttpException(
        ERROR_MESSAGES.UNEXPECTABLE_FAULT,
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return await this.findOnePatientRecord(savedPatientRecord.identifier, true);
  }

  // Update specialty consultation service for patient record
  async updateSpecialtyConsultation(
    updateSpecialtyConsultationDto: UpdateSpecialtyConsultationDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.findOnePatientRecord(
      updateSpecialtyConsultationDto.patientRecordIdentifier,
      true,
    );
    if (!existedRecord) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    } else if (existedRecord.serviceReports.length >= 2) {
      throw new HttpException(
        ERROR_MESSAGES.SPECIALTY_CONSULTATION_SPECIFIED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existedStaffWorkSchedule =
      await this.schedulesService.findOneStaffWorkScheduleByCondition(
        updateSpecialtyConsultationDto.workScheduleIdentifier,
        updateSpecialtyConsultationDto.physicianIdentifier,
      );
    if (!existedStaffWorkSchedule) {
      throw new HttpException(
        ERROR_MESSAGES.STAFF_WORK_SCHEDULE_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
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
        updateSpecialtyConsultationDto.patientRecordIdentifier,
        serviceInfo,
      ))
    ) {
      throw new HttpException(
        ERROR_MESSAGES.UNEXPECTABLE_FAULT,
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return await this.findOnePatientRecord(
      updateSpecialtyConsultationDto.patientRecordIdentifier,
      true,
    );
  }

  // Update laboratory tests service for patient record
  async updateLaboratoryAndImaging(
    updateLaboratoryAndImagingDto: UpdateLaboratoryAndImagingDto,
    currentUser: User,
  ): Promise<PatientRecord | null> {
    const existedRecord = await this.findOnePatientRecord(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
    );
    if (!existedRecord) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    updateLaboratoryAndImagingDto.serviceNames.forEach((serviceName) => {
      if (!Object.values(SERVICE_NAMES).includes(serviceName)) {
        throw new HttpException(
          ERROR_MESSAGES.SERVICE_NAME_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    await Promise.all(
      updateLaboratoryAndImagingDto.serviceNames.map(async (serviceName) => {
        if (
          !(await this.createServiceForPatientRecord(
            currentUser.identifier,
            null,
            updateLaboratoryAndImagingDto.patientRecordIdentifier,
            { name: serviceName },
          ))
        ) {
          throw new HttpException(
            ERROR_MESSAGES.UNEXPECTABLE_FAULT,
            HttpStatus.EXPECTATION_FAILED,
          );
        }
      }),
    );

    return await this.findOnePatientRecord(
      updateLaboratoryAndImagingDto.patientRecordIdentifier,
      true,
    );
  }

  async createServiceForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
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
        throw new HttpException(
          ERROR_MESSAGES.CREATE_INVOICE_FAIL,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const service = (await this.billingService.findOneServiceByCondition(
      serviceInfo,
    )) as Service;
    if (!service) {
      console.log('Service not found with info: ', serviceInfo);
      throw new HttpException(
        ERROR_MESSAGES.SERVICE_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceInvoiceCreated =
      await this.billingService.createInvoiceService({
        invoiceIdentifier: invoice.identifier,
        serviceIdentifier: service.identifier,
      });
    if (!serviceInvoiceCreated) {
      throw new HttpException(
        ERROR_MESSAGES.CREATE_INVOICE_SERVICE_FAIL,
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceReportCreated = await this.createServiceReportForPatientRecord(
      requesterIdentifier,
      performerIdentifier,
      patientRecordIdentifier,
      service.identifier,
      service.type,
    );
    return serviceReportCreated ? true : false;
  }

  async createServiceReportForPatientRecord(
    requesterIdentifier: number,
    performerIdentifier: number | null,
    patientRecordIdentifier: number,
    serviceIdentifier: number,
    serviceType: string,
  ): Promise<boolean> {
    const serviceReportEntity = mapServiceTypeToEntity.get(serviceType);
    if (!serviceReportEntity) {
      throw new HttpException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createServiceReportInfo = {
      patientRecordIdentifier,
      serviceIdentifier,
      requesterIdentifier,
      ...(performerIdentifier ? { performerIdentifier } : {}),
    };
    const serviceReport = await this.reportsService.createDetailServiceReport(
      serviceReportEntity as new () => T,
      createServiceReportInfo,
    );
    return serviceReport ? true : false;
  }
}
