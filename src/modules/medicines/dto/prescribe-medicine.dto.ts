import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MedicationInstructDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  medicationIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dosageInstruction: string;
}

export class PrescribeMedicineDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patientRecordIdentifier: number;

  @ApiProperty({ type: [MedicationInstructDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationInstructDto)
  @IsNotEmpty()
  instructions: MedicationInstructDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  advice: string;
}
