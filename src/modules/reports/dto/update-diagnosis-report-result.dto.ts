import { CreateAssessmentResultDto } from '@modules/assessments/dto/create-assessment-results.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateDiagnosisReportResultDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceReportIdentifier: number;

  @ApiProperty({ type: [CreateAssessmentResultDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentResultDto)
  assessmentResults: CreateAssessmentResultDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  severity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  conclusion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  effectiveTime: string;
}
