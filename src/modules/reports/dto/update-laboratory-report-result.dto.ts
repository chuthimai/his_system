import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateServiceReportResultDto } from './update-service-report.result.dto';

export class UpdateLaboratoryReportResultDto extends UpdateServiceReportResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  interpretation: string;
}
