import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateServiceReportResultDto } from './update-service-report.result.dto';

export class UpdateDiagnosisReportResultDto extends UpdateServiceReportResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  severity: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  conclusion: string = '';
}
