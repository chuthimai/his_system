import { PatientRecord } from '@modules/records/entities/patient-record.entity';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { QUEUE_NAME } from 'src/common/constants/others';

@Injectable()
export class CloseReportQueue {
  constructor(
    @InjectQueue(QUEUE_NAME.CLOSE_REPORT)
    private readonly queue: Queue,
  ) {}

  async add(data: { record: PatientRecord }) {
    await this.queue.add('handle-close-report', data);
  }
}
