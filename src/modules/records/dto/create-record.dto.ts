import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateRecordDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  patientIdentifier?: number;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsString()
  @IsPhoneNumber('VN')
  telecom?: string;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsDateString()
  birthDate?: string;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsBoolean()
  gender?: boolean;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsString()
  address?: string;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.patientIdentifier == undefined)
  @IsString()
  @MinLength(8)
  password?: string;
}
