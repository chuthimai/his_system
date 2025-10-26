import { RecordsService } from '@modules/records/records.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { HttpExceptionWrapper } from 'src/helpers/http-exception-wrapper';
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
    private readonly recordService: RecordsService,
  ) {}

  async findOneService(serviceIdentifier: number): Promise<Service | null> {
    return await this.serviceRepository.findOneBy({
      identifier: serviceIdentifier,
    });
  }

  async findOneServiceByCondition(condition: object): Promise<Service | null> {
    return await this.serviceRepository.findOneBy(condition);
  }

  async findOneInvoice(invoiceIdentifier: number): Promise<Invoice | null> {
    return await this.invoiceRepository.findOneBy({
      identifier: invoiceIdentifier,
    });
  }

  async findOneInvoiceByPatientRecordIdentifier(
    patientRecordIdentifier: number,
  ): Promise<Invoice | null> {
    return await this.invoiceRepository.findOneBy({
      patientRecordIdentifier: patientRecordIdentifier,
    });
  }

  async findAllServicesByTypes(type: string | null = null) {
    return this.serviceRepository.find({
      ...(type ? { where: { type } } : {}),
    });
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const existedPatientRecord = await this.recordService.findOnePatientRecord(
      createInvoiceDto.patientRecordIdentifier,
    );
    if (!existedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const newInvoice = this.invoiceRepository.create(createInvoiceDto);
    return await this.invoiceRepository.save(newInvoice);
  }

  async createInvoiceService(
    createInvoiceServiceDto: CreateInvoiceServiceDto,
  ): Promise<InvoiceService | boolean> {
    const existedInvoice = await this.findOneInvoice(
      createInvoiceServiceDto.invoiceIdentifier,
    );
    if (!existedInvoice) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.INVOICE_NOT_FOUND);
    }

    const existedService = await this.findOneService(
      createInvoiceServiceDto.serviceIdentifier,
    );
    if (!existedService) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }

    const newInvoiceService = this.invoiceServiceRepository.create(
      createInvoiceServiceDto,
    );
    return await this.invoiceServiceRepository.save(newInvoiceService);
  }

  async checkServiceIsPaid(
    patientRecordIdentifier: number,
    serviceIdentifier: number,
  ): Promise<boolean> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        patientRecordIdentifier,
        invoiceServices: { serviceIdentifier },
        status: true,
      },
    });

    return invoice ? true : false;
  }
}
