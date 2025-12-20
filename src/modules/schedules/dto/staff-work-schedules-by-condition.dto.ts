import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class StaffWorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.physicianIdentifier == undefined)
  @IsNumber()
  specialtyIdentifier?: number;
}
