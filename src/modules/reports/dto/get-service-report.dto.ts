import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetServiceReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patientRecordIdentifier: number;
}
