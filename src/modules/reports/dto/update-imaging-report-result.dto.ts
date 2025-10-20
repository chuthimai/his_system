import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateServiceReportResultDto } from './update-service-report.result.dto';
export class UpdateImagingReportResultDto extends UpdateServiceReportResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  focus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  interpretation: string;
}
