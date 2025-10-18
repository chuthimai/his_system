import { forwardRef, Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { MedicinesModule } from 'src/modules/medicines/medicines.module';
import { UsersModule } from 'src/modules/users/users.module';
import { BillingModule } from 'src/modules/billing/billing.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SchedulesModule } from '@modules/schedules/schedules.module';
import { ReportsModule } from '@modules/reports/reports.module';

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
