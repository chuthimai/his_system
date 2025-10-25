import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  async uploadBuffer(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.s3.send(putObjectCommand);

    return this.getSignedUrl(fileName);
  }

  async getSignedUrl(fileName: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    return (await getSignedUrl(this.s3, getObjectCommand, {
      expiresIn: 3600,
    })) as string;
  }
}
