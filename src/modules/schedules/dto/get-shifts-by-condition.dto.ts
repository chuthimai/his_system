import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ShiftConditionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;
}
