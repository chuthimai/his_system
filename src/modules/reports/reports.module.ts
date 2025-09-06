import { forwardRef, Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceReport } from './entities/service-report.entity';
import { BillingModule } from 'src/modules/billing/billing.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AssessmentsModule } from 'src/modules/assessments/assessments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceReport]),
    forwardRef(() => BillingModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AssessmentsModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule],
})
export class ReportsModule {}
