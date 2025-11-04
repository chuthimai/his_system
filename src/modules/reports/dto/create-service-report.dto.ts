import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patientRecordIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceIdentifier: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  performerIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  reporterIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  requesterIdentifier: number;
}
