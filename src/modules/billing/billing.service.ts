import { RecordsService } from '@modules/records/records.service';
import { Location } from '@modules/schedules/entities/location.entity';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { User } from '@modules/users/entities/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SERVICE_TYPES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceServiceDto } from './dto/create-invoice-service.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './entities/invoice-service.entity';
import { Service } from './entities/service.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceService)
    private readonly invoiceServiceRepository: Repository<InvoiceService>,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordService: RecordsService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
  ) {}

  async findOneService(serviceIdentifier: number): Promise<Service | null> {
    return await this.serviceRepository.findOneBy({
      identifier: serviceIdentifier,
    });
  }

  async findOneServiceByCondition(condition: object): Promise<Service | null> {
    return await this.serviceRepository.findOneBy(condition);
  }

  async findOneSpecialtyServiceByPatientRecord(
    patientRecordIdentifier: number,
  ): Promise<Service | null> {
    return await this.serviceRepository.findOne({
      where: {
        type: SERVICE_TYPES.SPECIALIST_CONSULTATION,
        invoiceServices: { invoice: { patientRecordIdentifier } },
      },
    });
  }

  async findOneInvoice(
    identifier: number,
    isFull: boolean = false,
  ): Promise<Invoice | null> {
    return !isFull
      ? await this.invoiceRepository.findOneBy({
          identifier,
        })
      : await this.invoiceRepository.findOne({
          where: { identifier },
          relations: ['invoiceServices', 'invoiceServices.service'],
        });
  }

  async findOneInvoiceByPatientRecordIdentifier(
    patientRecordIdentifier: number,
  ): Promise<Invoice | null> {
    return await this.invoiceRepository.findOneBy({
      patientRecordIdentifier: patientRecordIdentifier,
    });
  }

  async findAllServicesByTypes(type: string | null = null): Promise<Service[]> {
    return this.serviceRepository.find({
      ...(type ? { where: { type } } : {}),
    });
  }

  async findAllServicesRequired(currentUser: User): Promise<Service[]> {
    const existedPatientRecord =
      await this.recordService.findLatestPatientRecord(currentUser.identifier);
    if (!existedPatientRecord)
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

    const services = await this.serviceRepository.find({
      where: {
        invoiceServices: {
          invoice: { patientRecordIdentifier: existedPatientRecord.identifier },
        },
      },
    });

    return await Promise.all(
      services.map(async (service) => {
        service.location = (await this.scheduleService.findOneLocation(
          service.locationIdentifier,
        )) as Location;
        return service;
      }),
    );
  }

  async findAllInvoices(currentUser: User): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { patientRecord: { patientIdentifier: currentUser.identifier } },
    });
  }

  @Transactional()
  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const existedPatientRecord = await this.recordService.findOne(
        createInvoiceDto.patientRecordIdentifier,
      );
      if (!existedPatientRecord)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);

      const newInvoice = this.invoiceRepository.create(createInvoiceDto);
      return await this.invoiceRepository.save(newInvoice);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_INVOICE_FAIL}`,
      );
    }
  }

  @Transactional()
  async createInvoiceService(
    createInvoiceServiceDto: CreateInvoiceServiceDto,
  ): Promise<void> {
    try {
      const existedInvoice = await this.findOneInvoice(
        createInvoiceServiceDto.invoiceIdentifier,
      );
      if (!existedInvoice)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.INVOICE_NOT_FOUND);

      const existedService = await this.findOneService(
        createInvoiceServiceDto.serviceIdentifier,
      );
      if (!existedService)
        throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);

      const newInvoiceService = this.invoiceServiceRepository.create(
        createInvoiceServiceDto,
      );
      await this.invoiceServiceRepository.save(newInvoiceService);
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_INVOICE_SERVICE_FAIL}`,
      );
    }
  }

  async checkServiceIsPaid(
    patientRecordIdentifier: number,
    serviceIdentifier: number,
  ): Promise<boolean> {
    return (await this.invoiceRepository.findOne({
      where: {
        patientRecordIdentifier,
        invoiceServices: { serviceIdentifier },
        status: true,
      },
    }))
      ? true
      : false;
  }
}
