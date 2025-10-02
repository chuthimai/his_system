import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/others';

@Controller('records')
export class RecordsController {
  constructor(private readonly RecordsService: RecordsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.RecordsService.create(createRecordDto);
  }
}
