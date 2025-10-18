import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

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
}
