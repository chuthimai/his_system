import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  identifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
