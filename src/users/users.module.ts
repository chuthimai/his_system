import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { Physician } from './entities/physician.entity';
import { SpecializationsModule } from 'src/specializations/specializations.module';
import { InsurancesModule } from 'src/insurances/insurances.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MedicinesModule } from 'src/medicines/medicines.module';
import { RecordsModule } from 'src/records/records.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Staff, Physician]),
    forwardRef(() => SpecializationsModule),
    forwardRef(() => InsurancesModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MedicinesModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
