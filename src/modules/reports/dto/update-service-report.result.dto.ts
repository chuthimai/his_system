import { CreateAssessmentResultDto } from '@modules/assessments/dto/create-assessment-results.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdateServiceReportResultDto {
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
}
