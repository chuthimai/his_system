import { EthersModule } from '@modules/ethers/ethers.module';
import { HieModule } from '@modules/hie/hie.module';
import { MessageModule } from '@modules/messages/messages.module';
import { S3Module } from '@modules/s3/s3.module';
import { TaskModule } from '@modules/tasks/task.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { RecordsModule } from './modules/records/records.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { SpecializationsModule } from './modules/specializations/specializations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: getDataSourceToken(),
          }),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    UsersModule,
    SpecializationsModule,
    SchedulesModule,
    AppointmentsModule,
    MedicinesModule,
    RecordsModule,
    BillingModule,
    AssessmentsModule,
    ReportsModule,
    AuthModule,
    MessageModule,
    S3Module,
    EthersModule,
    HieModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
