import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescribedMedicationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dosageInstruction: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  medicationIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  prescriptionIdentifier: number;
}
