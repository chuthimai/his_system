import { AuthModule } from '@modules/auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';

import { Qualification } from './entities/qualification.entity';
import { Specialty } from './entities/specialty.entity';
import { SpecializationsController } from './specializations.controller';
import { SpecializationsService } from './specializations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qualification, Specialty]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
  exports: [TypeOrmModule, SpecializationsService],
})
export class SpecializationsModule {}
