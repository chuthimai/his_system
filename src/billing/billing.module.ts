import { forwardRef, Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Invoice } from './entities/invoice.entity';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Invoice]),
    forwardRef(() => SchedulesModule),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [TypeOrmModule],
})
export class BillingModule {}
