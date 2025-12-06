import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';
import {Transform} from "class-transformer";

export class StaffWorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => Number(value))
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.physicianIdentifier == undefined)
  @IsNumber()
  specialtyIdentifier?: number;
}
