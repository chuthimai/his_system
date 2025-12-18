import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class WorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  physicianIdentifier?: number;
}
