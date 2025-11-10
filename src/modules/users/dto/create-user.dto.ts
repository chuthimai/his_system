import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN')
  telecom: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
