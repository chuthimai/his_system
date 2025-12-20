import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { REPORT_TYPES, VALID_DATE_REGEX } from 'src/common/constants/others';

export type ReportType = (typeof REPORT_TYPES)[keyof typeof REPORT_TYPES];

export class SummaryReportsQueryDto {
  @ApiProperty()
  @IsOptional()
  @Matches(VALID_DATE_REGEX, {
    message: ERROR_MESSAGES.INVALID_DATE,
  })
  startDate: string = '1000-01-01';

  @ApiProperty()
  @IsOptional()
  @Matches(VALID_DATE_REGEX, {
    message: ERROR_MESSAGES.INVALID_DATE,
  })
  endDate: string = '9999-12-31';

  @ApiProperty()
  @IsEnum(REPORT_TYPES)
  @IsString()
  reportType: string;
}
