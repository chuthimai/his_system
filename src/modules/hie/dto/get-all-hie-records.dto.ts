import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetAllHieRecordsDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  hospitalIdentifier: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  patientIdentifier: number;
}
