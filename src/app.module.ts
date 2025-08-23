import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { InsurancesModule } from './insurances/insurances.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicinesModule } from './medicines/medicines.module';
import { RecordsModule } from './records/records.module';
import { BillingModule } from './billing/billing.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { ReportsModule } from './reports/reports.module';

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
      }),
    }),
    UsersModule,
    SpecializationsModule,
    InsurancesModule,
    SchedulesModule,
    AppointmentsModule,
    MedicinesModule,
    RecordsModule,
    BillingModule,
    AssessmentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
