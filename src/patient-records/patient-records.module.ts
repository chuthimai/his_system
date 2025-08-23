import { forwardRef, Module } from '@nestjs/common';
import { PatientRecordsService } from './patient-records.service';
import { PatientRecordsController } from './patient-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { MedicinesModule } from 'src/medicines/medicines.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientRecord]),
    forwardRef(() => MedicinesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PatientRecordsController],
  providers: [PatientRecordsService],
  exports: [TypeOrmModule],
})
export class PatientRecordsModule {}
