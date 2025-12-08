import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import {Transform} from "class-transformer";

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  workScheduleIdentifier: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => Number(value))
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => Number(value))
  @IsNumber()
  userIdentifier: number;
}
