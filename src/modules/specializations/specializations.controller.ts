import { Controller, Get, UseGuards } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/roles';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';

@Controller('specializations')
export class SpecializationsController {
  constructor(
    private readonly specializationsService: SpecializationsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get()
  findAll() {
    return this.specializationsService.findAll();
  }
}
