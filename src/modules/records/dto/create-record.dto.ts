import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRecordDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  patientIdentifier?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  telecom?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty()
  @IsOptional()
  gender?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
