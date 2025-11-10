import { ApiProperty } from '@nestjs/swagger';
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
  @IsNumber()
  physicianIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request: string;
}
