import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class StaffWorkScheduleConditionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.physicianIdentifier == undefined)
  @IsNumber()
  specialtyIdentifier?: number;
}
