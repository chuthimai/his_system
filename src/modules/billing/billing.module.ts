import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsModule } from 'src/modules/assessments/assessments.module';
import { RecordsModule } from 'src/modules/records/records.module';
import { ReportsModule } from 'src/modules/reports/reports.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './entities/invoice-service.entity';
import { Service } from './entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Invoice, InvoiceService]),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AssessmentsModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [TypeOrmModule, BillingService],
})
export class BillingModule {}
