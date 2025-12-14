import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  performerIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  reporterIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  requesterIdentifier: number;
}
