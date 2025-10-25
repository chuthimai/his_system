import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSpecimenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  laboratoryReportIdentifier: number;
}
