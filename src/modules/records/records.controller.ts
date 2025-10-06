import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/others';
import { CurrentUser } from 'src/decorators/current-user.decorator.dto';
import { User } from '@modules/users/entities/user.entity';
import { UpdateLaboratoryAndImagingDto } from './dto/update-laboratory-and-imaging.dto';
import { UpdateSpecialtyConsultationDto } from './dto/update-specialty-consultation.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post()
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.create(createRecordDto, currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-specialty-consultation')
  async updateSpecialtyConsultation(
    @Body() updateRecordDto: UpdateSpecialtyConsultationDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.updateSpecialtyConsultation(
      updateRecordDto,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/update-test-and-scan')
  async updateLaboratoryAndImaging(
    @Body() updateRecord2Dto: UpdateLaboratoryAndImagingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.recordsService.updateLaboratoryAndImaging(
      updateRecord2Dto,
      currentUser,
    );
  }
}
