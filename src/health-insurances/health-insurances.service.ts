import { Injectable } from '@nestjs/common';
import { CreateHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { UpdateHealthInsuranceDto } from './dto/update-health-insurance.dto';

@Injectable()
export class HealthInsurancesService {
  create(createHealthInsuranceDto: CreateHealthInsuranceDto) {
    return 'This action adds a new healthInsurance';
  }

  findAll() {
    return `This action returns all healthInsurances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthInsurance`;
  }

  update(id: number, updateHealthInsuranceDto: UpdateHealthInsuranceDto) {
    return `This action updates a #${id} healthInsurance`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthInsurance`;
  }
}
