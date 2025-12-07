import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import {Transform} from "class-transformer";

export class WorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => Number(value))
  @IsNumber()
  physicianIdentifier?: number;
}
