import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  advice: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  physicianIdentifier: number;
}
