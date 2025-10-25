import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
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
}
