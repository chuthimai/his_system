import { ReportsService } from '@modules/reports/reports.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from '@nestjs-cls/transactional';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
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

  async findOneAssessmentItem(
    identifier: number,
  ): Promise<AssessmentItem | null> {
    return await this.assessmentItemRepository.findOne({
      where: { identifier },
      relations: [
        'parent',
        'parent.parent',
        'parent.parent.parent',
        'measurementItem',
        'parent.measurementItem',
        'parent.parent.measurementItem',
        'parent.parent.parent.measurementItem',
      ],
    });
  }

  async findAllAssessmentItems(
    serviceIdentifier: number,
  ): Promise<AssessmentItem[]> {
    return await this.assessmentItemRepository.find({
      where: { serviceIdentifier, parentIdentifier: IsNull() },
      relations: [
        'children',
        'children.children',
        'children.children.children',
        'measurementItem',
        'children.measurementItem',
        'children.children.measurementItem',
        'children.children.children.measurementItem',
      ],
    });
  }

  @Transactional()
  async createAssessmentResults(
    createAssessmentResults: CreateAssessmentResultsDto,
  ): Promise<void> {
    try {
      const existedServiceReport = await this.reportsService.findOne(
        createAssessmentResults.serviceReportIdentifier,
      );
      if (!existedServiceReport)
        throw new Error(ERROR_MESSAGES.SERVICE_REPORT_NOT_FOUND);

      await Promise.all(
        createAssessmentResults.assessmentResults.map(
          async (assessmentResult) => {
            const preCondition = {
              assessmentItemIdentifier:
                assessmentResult.assessmentItemIdentifier,
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

            targetAssessmentResult.value =
              assessmentResult.assessmentResultValue;
            return await this.assessmentResultRepository.save(
              targetAssessmentResult,
            );
          },
        ),
      );
    } catch (err) {
      console.log(err);
      // throw new HttpExceptionWrapper(
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      //   `${err.message}, ${ERROR_MESSAGES.CREATE_ASSESSMENT_RESULT_FAIL}`,
      // );
    }
  }
}
