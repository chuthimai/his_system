import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetch as undiciFetch, FormData } from 'undici';

import { CreateHieRecordDto } from './dto/create-hie-record.dto';

@Injectable()
export class HieService {
  private hieUrl: string;

  constructor(private configService: ConfigService) {
    this.hieUrl = this.configService.getOrThrow<string>('HIE_URL');
  }

  async pushRecord(
    createRecordDto: CreateHieRecordDto,
    record: Express.Multer.File,
  ): Promise<{ fileId: number; fileHash: string } | undefined> {
    const form = new FormData();
    form.append('hospitalIdentifier', createRecordDto.hospitalIdentifier);
    form.append('patientIdentifier', createRecordDto.patientIdentifier);

    const uint8 = new Uint8Array(record.buffer);
    form.append(
      'record',
      new globalThis.File([uint8], record.originalname, {
        type: record.mimetype,
      }),
    );

    const res = await undiciFetch(`${this.hieUrl}/records`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) return undefined;

    const data = (await res.json()) as { fileId: number; fileHash: string };
    console.log(data);

    return {
      fileId: data.fileId,
      fileHash: data.fileHash,
    };
  }
}
