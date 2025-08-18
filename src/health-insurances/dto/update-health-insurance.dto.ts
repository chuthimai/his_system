import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthInsuranceDto } from './create-health-insurance.dto';

export class UpdateHealthInsuranceDto extends PartialType(CreateHealthInsuranceDto) {}
