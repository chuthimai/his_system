import { forwardRef, Module } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qualification } from './entities/qualification.entity';
import { Specialty } from './entities/specialty.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qualification, Specialty]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
  exports: [TypeOrmModule],
})
export class SpecializationsModule {}
