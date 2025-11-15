import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ServiceInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceRequest: string;
}

export class UpdateLaboratoryAndImagingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patientRecordIdentifier: number;

  @ApiProperty({ type: [ServiceInfoDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceInfoDto)
  serviceInfo: ServiceInfoDto[];
}
