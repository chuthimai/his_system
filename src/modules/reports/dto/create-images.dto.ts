import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateImagesDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  imagingReportIdentifier: number;
}
