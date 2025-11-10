import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    } as S3ClientConfig);
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') ?? '';
  }

  async getSignedUrl(fileName: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    return await getSignedUrl(this.s3, getObjectCommand, {
      expiresIn: 3600,
    });
  }

  async uploadBuffer(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<boolean> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(putObjectCommand);
    return true;
  }

  async uploadFile(
    filePath: string,
    fileName: string,
    contentType?: string,
  ): Promise<boolean> {
    const fileBuffer = fs.readFileSync(filePath);

    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3.send(putObjectCommand);
    return true;
  }
}
