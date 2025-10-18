import { RecordsModule } from '@modules/records/records.module';
import { SchedulesModule } from '@modules/schedules/schedules.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsModule } from 'src/modules/assessments/assessments.module';
import { BillingModule } from 'src/modules/billing/billing.module';
import { UsersModule } from 'src/modules/users/users.module';

import { DiagnosisReport } from './entities/diagnosis-report.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { LaboratoryReport } from './entities/laboratory-report.entity';
import { ServiceReport } from './entities/service-report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceReport,
      DiagnosisReport,
      LaboratoryReport,
      ImagingReport,
    ]),
    forwardRef(() => BillingModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AssessmentsModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AssessmentsModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule {}
