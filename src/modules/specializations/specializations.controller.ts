import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/common/constants/others';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { SpecializationsService } from './specializations.service';

@Controller('specializations')
export class SpecializationsController {
  constructor(
    private readonly specializationsService: SpecializationsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT, ROLES.PHYSICIAN)
  @Get()
  findAll() {
    return this.specializationsService.findAll();
  }
}
