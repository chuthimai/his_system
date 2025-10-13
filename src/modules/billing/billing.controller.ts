import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceServiceDto } from './dto/create-invoice-service.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('/invoice-services')
  createInvoiceService(
    @Body() createServiceInvoiceDto: CreateInvoiceServiceDto,
  ) {
    return this.billingService.createInvoiceService(createServiceInvoiceDto);
  }
}
