import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {Transform} from "class-transformer";

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  advice: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({value}) => Number(value))
  @IsNumber()
  physicianIdentifier: number;
}
