import { forwardRef, Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceReport } from './entities/service-report.entity';
import { BillingModule } from 'src/modules/billing/billing.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AssessmentsModule } from 'src/modules/assessments/assessments.module';
import { RecordsModule } from '@modules/records/records.module';
import { PatientRecord } from '@modules/records/entities/patient-record.entity';
import { DiagnosisReport } from './entities/diagnosis-report.entity';
import { LaboratoryReport } from './entities/laboratory-report.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { SchedulesModule } from '@modules/schedules/schedules.module';

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
