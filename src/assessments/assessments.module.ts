import { forwardRef, Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentItem } from './entities/assessment-item.entity';
import { AssessmentQuestion } from './entities/assessment-question.entity';
import { MeasurementIndicator } from './entities/measurement-indicator.entity';
import { BillingModule } from 'src/billing/billing.module';
import { AssessmentCategory } from './entities/assessment-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentItem,
      AssessmentQuestion,
      MeasurementIndicator,
      AssessmentCategory,
    ]),
    forwardRef(() => BillingModule),
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [TypeOrmModule],
})
export class AssessmentsModule {}
