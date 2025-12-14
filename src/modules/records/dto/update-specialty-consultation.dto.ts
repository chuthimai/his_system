import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSpecialtyConsultationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patientRecordIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  workScheduleIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  physicianIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request: string;
}
