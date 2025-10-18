import { ReportsService } from '@modules/reports/reports.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { IsNull, Repository } from 'typeorm';

import { CreateAssessmentResultsDto } from './dto/create-assessment-results.dto';
import { AssessmentItem } from './entities/assessment-item.entity';
import { AssessmentResult } from './entities/assessment-result.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(AssessmentItem)
    private readonly assessmentItemRepository: Repository<AssessmentItem>,
    @InjectRepository(AssessmentResult)
    private readonly assessmentResultRepository: Repository<AssessmentResult>,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportsService: ReportsService,
  ) {}

  async findAllAssessmentItems(
    serviceIdentifier: number,
  ): Promise<AssessmentItem[]> {
    return this.assessmentItemRepository.find({
      where: { serviceIdentifier, parentIdentifier: IsNull() },
      relations: [
        'children',
        'children.children',
        'children.children.children',
      ],
    });
  }

  async createAssessmentResults(
    createAssessmentResults: CreateAssessmentResultsDto,
  ): Promise<boolean> {
    const serviceReport = await this.reportsService.findOne(
      createAssessmentResults.serviceReportIdentifier,
    );
    if (!serviceReport) {
      throw new Error(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);
    }

    const assessmentResultsCreated = await Promise.all(
      createAssessmentResults.assessmentResults.map(
        async (assessmentResult) => {
          const preCondition = {
            assessmentItemIdentifier: assessmentResult.assessmentItemIdentifier,
            serviceReportIdentifier:
              createAssessmentResults.serviceReportIdentifier,
          };

          let targetAssessmentResult =
            await this.assessmentResultRepository.findOne({
              where: preCondition,
            });
          if (!targetAssessmentResult) {
            targetAssessmentResult =
              this.assessmentResultRepository.create(preCondition);
          }

          targetAssessmentResult.value = assessmentResult.assessmentResultValue;

          const savedAssessmentResult =
            await this.assessmentResultRepository.save(targetAssessmentResult);
          if (!savedAssessmentResult) {
            throw new Error(ERROR_MESSAGES.CREATE_ASSESSMENT_RESULT_FAIL);
          }
        },
      ),
    );
    return assessmentResultsCreated ? true : false;
  }
}
