import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetch as undiciFetch, FormData } from 'undici';

import { CreateHieRecordDto } from './dto/create-hie-record.dto';
import { GetAllHieRecordsDto } from './dto/get-all-hie-records.dto';

@Injectable()
export class HieService {
  private hieUrl: string;

  constructor(private configService: ConfigService) {
    this.hieUrl = this.configService.getOrThrow<string>('HIE_URL');
  }

  async getAllRecords(getAllHieRecordsDto: GetAllHieRecordsDto): Promise<any> {
    const res = await undiciFetch(`${this.hieUrl}/records/by-patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getAllHieRecordsDto),
    });
    if (!res.ok) return await res.json();
    return await res.text();
  }

  async pushRecord(
    createRecordDto: CreateHieRecordDto,
    record: Buffer,
  ): Promise<{ fileId: number; fileHash: string } | undefined> {
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
    });

    if (!res.ok) return undefined;
    return (await res.json()) as { fileId: number; fileHash: string };
  }
}
