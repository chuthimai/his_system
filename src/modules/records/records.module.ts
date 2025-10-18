import { AuthModule } from '@modules/auth/auth.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { SchedulesModule } from '@modules/schedules/schedules.module';
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
    forwardRef(() => MedicinesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => BillingModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [TypeOrmModule, RecordsService],
})
export class RecordsModule {}
