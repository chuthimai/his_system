import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateAssessmentResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  assessmentItemIdentifier?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  assessmentResultValue: string;
}

export class CreateAssessmentResultsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceReportIdentifier: number;

  @ApiProperty({ type: [CreateAssessmentResultDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentResultDto)
  assessmentResults: CreateAssessmentResultDto[];
}
