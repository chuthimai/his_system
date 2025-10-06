import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class WorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  physicianIdentifier?: number;
}
