import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { User } from '@modules/users/entities/user.entity';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { CurrentUser } from 'src/common/decorators/current-user.decorator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/services-by-type')
  getAllServicesByType(@Query('type') type: string) {
    return this.billingService.findAllServicesByTypes(type);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/services-required')
  getAllServiceRequired(@CurrentUser() currentUser: User) {
    return this.billingService.findAllServicesRequired(currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/invoices')
  getAllInvoices(@CurrentUser() currentUser: User) {
    return this.billingService.findAllInvoices(currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/invoices/:invoiceIdentifier')
  getOneInvoice(@Param('invoiceIdentifier') invoiceIdentifier: number) {
    return this.billingService.findOneInvoice(invoiceIdentifier, true);
  }
}
