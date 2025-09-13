import { Controller, Post, Body } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly RecordsService: RecordsService) {}

  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.RecordsService.create(createRecordDto);
  }
}
