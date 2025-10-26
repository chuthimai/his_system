import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  advice: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  physicianIdentifier: number;
}
