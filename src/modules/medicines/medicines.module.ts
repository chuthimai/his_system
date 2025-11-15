import { BillingModule } from '@modules/billing/billing.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsModule } from 'src/modules/records/records.module';
import { UsersModule } from 'src/modules/users/users.module';

import { Medication } from './entities/medication.entity';
import { PrescribedMedication } from './entities/prescribed-medication.entity';
import { Prescription } from './entities/prescription.entity';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medication, Prescription, PrescribedMedication]),
    forwardRef(() => UsersModule),
    forwardRef(() => RecordsModule),
    forwardRef(() => BillingModule),
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
  exports: [TypeOrmModule, MedicinesService],
})
export class MedicinesModule {}
