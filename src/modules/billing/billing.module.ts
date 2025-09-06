import { forwardRef, Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Invoice } from './entities/invoice.entity';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { AssessmentsModule } from 'src/modules/assessments/assessments.module';
import { RecordsModule } from 'src/modules/records/records.module';
import { ReportsModule } from 'src/modules/reports/reports.module';

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
