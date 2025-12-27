import { AuthModule } from '@modules/auth/auth.module';
import { HieModule } from '@modules/hie/hie.module';
import { PaymentModule } from '@modules/payments/payments.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { S3Module } from '@modules/s3/s3.module';
import { SchedulesModule } from '@modules/schedules/schedules.module';
import { TaskModule } from '@modules/tasks/task.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingModule } from 'src/modules/billing/billing.module';
import { MedicinesModule } from 'src/modules/medicines/medicines.module';
import { UsersModule } from 'src/modules/users/users.module';

import { PatientRecord } from './entities/patient-record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientRecord]),
    forwardRef(() => UsersModule),
    forwardRef(() => BillingModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => MedicinesModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => TaskModule),
    S3Module,
    HieModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [TypeOrmModule, RecordsService],
})
export class RecordsModule {}
