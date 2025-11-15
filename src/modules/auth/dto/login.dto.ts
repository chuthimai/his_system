import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { ROLES } from 'src/common/constants/others';

export class LoginDto {
  @ApiProperty({ enum: Object.values(ROLES) })
  @IsNotEmpty()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(Object.values(ROLES), { message: ERROR_MESSAGES.INVALID_ROLE })
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  identifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deviceToken?: string;
}
