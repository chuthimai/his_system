import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthInsurancesService } from './health-insurances.service';
import { CreateHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { UpdateHealthInsuranceDto } from './dto/update-health-insurance.dto';

@Controller('health-insurances')
export class HealthInsurancesController {
  constructor(private readonly healthInsurancesService: HealthInsurancesService) {}

  @Post()
  create(@Body() createHealthInsuranceDto: CreateHealthInsuranceDto) {
    return this.healthInsurancesService.create(createHealthInsuranceDto);
  }

  @Get()
  findAll() {
    return this.healthInsurancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthInsurancesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthInsuranceDto: UpdateHealthInsuranceDto) {
    return this.healthInsurancesService.update(+id, updateHealthInsuranceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthInsurancesService.remove(+id);
  }
}
