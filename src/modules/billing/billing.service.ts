import { MessageService } from '@modules/messages/messages.service';
import { PaymentService } from '@modules/payments/payments.service';
import { RecordsService } from '@modules/records/records.service';
import { Location } from '@modules/schedules/entities/location.entity';
import { SchedulesService } from '@modules/schedules/schedules.service';
import { User } from '@modules/users/entities/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import * as node from '@payos/node';
import { Notification } from 'firebase-admin/messaging';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SERVICE_TYPES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/wrapper';
import { Repository } from 'typeorm';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceServiceDto } from './dto/create-invoice-service.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './entities/invoice-service.entity';
import { Service } from './entities/service.entity';

@Injectable()
export class BillingService {
  private processingTransactions: node.CreatePaymentLinkResponse[] = [];

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
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
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

  async findAllInvoiceServicesByInvoiceIdentifier(
    invoiceIdentifier: number,
  ): Promise<InvoiceService[]> {
    return await this.invoiceServiceRepository.findBy({ invoiceIdentifier });
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

  @Transactional()
  async createTransaction(
    recordIdentifier: number,
    currentUserIdentifier: number,
  ): Promise<node.CreatePaymentLinkResponse> {
    try {
      const existedRecord = await this.recordService.findOne(recordIdentifier);
      if (!existedRecord) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
      }

      if (currentUserIdentifier !== existedRecord.patientIdentifier) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PERMISSION_DENIED);
      }

      const invoice =
        await this.findOneInvoiceByPatientRecordIdentifier(recordIdentifier);
      if (!invoice) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.INVOICE_NOT_FOUND);
      } else if (invoice.status) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PAID_INVOICE);
      }

      const existedTransactions = this.processingTransactions.find(
        (transaction) => transaction.paymentLinkId === invoice.paymentCode,
      );
      if (existedTransactions) return existedTransactions;

      const invoiceServices =
        await this.findAllInvoiceServicesByInvoiceIdentifier(
          invoice.identifier,
        );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      invoice.total = invoiceServices.reduce(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (sum, invoiceService) => sum + invoiceService.price,
        0,
      );

      const paymentInfo = await this.paymentService.createPayment(
        invoice.total,
        `Thanh toán viện phí #${invoice.identifier}`,
      );

      invoice.paymentCode = paymentInfo.paymentLinkId;
      await this.invoiceRepository.save(invoice);

      this.processingTransactions.push(paymentInfo);
      return paymentInfo;
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.CREATE_TRANSACTION_FAIL}`,
      );
    }
  }

  @Transactional()
  async updateTransaction(paymentInfo: node.PaymentLink): Promise<void> {
    try {
      let invoice = await this.invoiceRepository.findOne({
        where: { paymentCode: paymentInfo.id },
        relations: ['patientRecord', 'patientRecord.patient'],
      });
      if (!invoice) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.INVOICE_NOT_FOUND);
      }

      const now = new Date();
      const dateFormatted = now.toISOString().split('T')[0];

      invoice = { ...invoice, status: true, paidTime: dateFormatted };
      await this.invoiceRepository.save(invoice);

      this.processingTransactions = this.processingTransactions.filter(
        (transaction) => transaction.paymentLinkId !== invoice.paymentCode,
      );

      if (invoice.patientRecord.patient.deviceToken) {
        await this.messageService.sendToDevice(
          invoice.patientRecord.patient.deviceToken,
          this.makeNotification(invoice.identifier, paymentInfo),
        );
      }
    } catch (err) {
      throw new HttpExceptionWrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `${err.message}, ${ERROR_MESSAGES.UPDATE_TRANSACTION_FAIL}`,
      );
    }
  }

  async checkTransaction(recordIdentifier: number): Promise<node.PaymentLink> {
    const existedRecord = await this.recordService.findOne(recordIdentifier);
    if (!existedRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    const invoice =
      await this.findOneInvoiceByPatientRecordIdentifier(recordIdentifier);
    if (!invoice) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.INVOICE_NOT_FOUND);
    }

    return await this.paymentService.checkPayment(invoice.paymentCode);
  }

  private makeNotification(
    invoiceIdentifier: number,
    paymentInfo: node.PaymentLink,
  ): Notification {
    const { amount, transactions } = paymentInfo;

    return {
      title: `Thanh toán viện phí thành công #${invoiceIdentifier}`,
      body: `Hóa đơn #${invoiceIdentifier} đã được thanh toán ${amount} VND. Người chuyển: ${transactions[0].counterAccountName}. Mã GD: ${transactions[0].reference} lúc ${transactions[0].transactionDateTime}.`,
    };
  }
}
