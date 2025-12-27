import { EthersModule } from '@modules/ethers/ethers.module';
import { HieModule } from '@modules/hie/hie.module';
import { MedicinesModule } from '@modules/medicines/medicines.module';
import { RecordsModule } from '@modules/records/records.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { S3Module } from '@modules/s3/s3.module';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants/others';

import { CloseReportProcessor } from './processors/close-report.processor';
import { CloseReportQueue } from './queues/close-report.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({ name: QUEUE_NAME.CLOSE_REPORT }),
    forwardRef(() => RecordsModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => MedicinesModule),
    forwardRef(() => S3Module),
    forwardRef(() => HieModule),
    forwardRef(() => EthersModule),
  ],
  providers: [CloseReportQueue, CloseReportProcessor],
  exports: [CloseReportQueue],
})
export class TaskModule {}
