import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Agent, fetch as undiciFetch, FormData} from 'undici';

import { CreateHieRecordDto } from './dto/create-hie-record.dto';
import { GetAllHieRecordsDto } from './dto/get-all-hie-records.dto';

@Injectable()
export class HieService {
  private hieUrl: string;
  private agent:Agent;

  constructor(private configService: ConfigService) {
    this.hieUrl = this.configService.getOrThrow<string>('HIE_URL');
    this.agent = new Agent({
      connect: {
        rejectUnauthorized: false,  // TODO: Bypass SSL
      },
    });
  }

  async getAllRecords(getAllHieRecordsDto: GetAllHieRecordsDto): Promise<any> {
    const res = await undiciFetch(`${this.hieUrl}/records/by-patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getAllHieRecordsDto),
      dispatcher: this.agent,
    });
    return await res.json();
  }

  async pushRecord(
    createRecordDto: CreateHieRecordDto,
    record: Buffer,
  ): Promise<
    { fileId: number; fileHash: string; fileSignature: string } | undefined
  > {
    const form = new FormData();
    form.append('hospitalIdentifier', createRecordDto.hospitalIdentifier);
    form.append('patientIdentifier', createRecordDto.patientIdentifier);

    const fileBuffer = Buffer.from(record);
    const uint8 = new Uint8Array(fileBuffer);

    form.append(
      'record',
      new Blob([uint8], { type: 'application/pdf' }),
      'record.pdf',
    );

    const res = await undiciFetch(`${this.hieUrl}/records`, {
      method: 'POST',
      body: form,
      dispatcher: this.agent,
    });

    if (!res.ok) return undefined;
    return (await res.json()) as {
      fileId: number;
      fileHash: string;
      fileSignature: string;
    };
  }
}
