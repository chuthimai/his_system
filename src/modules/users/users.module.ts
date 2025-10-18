import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MedicinesModule } from 'src/modules/medicines/medicines.module';
import { RecordsModule } from 'src/modules/records/records.module';
import { ReportsModule } from 'src/modules/reports/reports.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { SpecializationsModule } from 'src/modules/specializations/specializations.module';

import { Physician } from './entities/physician.entity';
import { Staff } from './entities/staff.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Staff, Physician]),
    forwardRef(() => SpecializationsModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MedicinesModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RecordsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
