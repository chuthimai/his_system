import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class StaffWorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  specialtyIdentifier?: number;
}
