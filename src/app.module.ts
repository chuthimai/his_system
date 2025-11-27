import { EthersModule } from '@modules/ethers/ethers.module';
import { S3Module } from '@modules/s3/s3.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
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
    S3Module,
    EthersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
