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

  // For check existence in createInvoice function here
  async findOneService(serviceIdentifier: number) {
    return await this.serviceRepository.findOneBy({
      identifier: serviceIdentifier,
    });
  }

  // For check existence in createServiceForPatientRecord function in records service
  async findOneServiceByCondition(condition: object) {
    return await this.serviceRepository.findOneBy(condition);
  }

  // For check existence in createInvoice function here
  async findOneInvoice(invoiceIdentifier: number) {
    return await this.invoiceRepository.findOneBy({
      identifier: invoiceIdentifier,
    });
  }

  // For check existence in createServiceForPatientRecord function in records service
  async findOneInvoiceByPatientRecordIdentifier(
    patientRecordIdentifier: number,
  ) {
    return await this.invoiceRepository.findOneBy({
      patientRecordIdentifier: patientRecordIdentifier,
    });
  }

  async findAllServicesByTypes(type: string | null = null) {
    return this.serviceRepository.find({
      ...(type ? { where: { type } } : {}),
    });
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const existedPatientRecord = await this.recordService.findOnePatientRecord(
      createInvoiceDto.patientRecordIdentifier,
    );
    if (!existedPatientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const newInvoice = this.invoiceRepository.create(createInvoiceDto);
    return await this.invoiceRepository.save(newInvoice);
  }

  async createInvoiceService(createInvoiceServiceDto: CreateInvoiceServiceDto) {
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
    const savedInvoiceService =
      await this.invoiceServiceRepository.save(newInvoiceService);
    return savedInvoiceService ? true : false;
  }
}
