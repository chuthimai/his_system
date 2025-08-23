import { forwardRef, Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescribedMedication } from './entities/prescribed-medication.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medication, Prescription, PrescribedMedication]),
    forwardRef(() => UsersModule),
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
  exports: [TypeOrmModule],
})
export class MedicinesModule {}
