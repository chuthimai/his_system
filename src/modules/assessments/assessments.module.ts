import { ReportsModule } from '@modules/reports/reports.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingModule } from 'src/modules/billing/billing.module';

import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { AssessmentItem } from './entities/assessment-item.entity';
import { AssessmentResult } from './entities/assessment-result.entity';
import { MeasurementItems } from './entities/measurement-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentItem,
      MeasurementItems,
      AssessmentResult,
    ]),
    forwardRef(() => BillingModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [TypeOrmModule, AssessmentsService],
})
export class AssessmentsModule {}
