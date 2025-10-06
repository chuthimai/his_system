import { forwardRef, Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentItem } from './entities/assessment-item.entity';
import { MeasurementItems } from './entities/measurement-item.entity';
import { BillingModule } from 'src/modules/billing/billing.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { AssessmentResult } from './entities/assessment-result.entity';

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
