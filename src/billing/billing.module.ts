import { forwardRef, Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Invoice } from './entities/invoice.entity';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { RecordsModule } from 'src/records/records.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Invoice]),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AssessmentsModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [TypeOrmModule],
})
export class BillingModule {}
