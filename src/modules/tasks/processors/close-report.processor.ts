import { EthersService } from '@modules/ethers/ethers.service';
import { HieService } from '@modules/hie/hie.service';
import { MedicinesService } from '@modules/medicines/medicines.service';
import { PatientRecord } from '@modules/records/entities/patient-record.entity';
import { RecordsService } from '@modules/records/records.service';
import { ReportsService } from '@modules/reports/reports.service';
import { S3Service } from '@modules/s3/s3.service';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import type { Job } from 'bull';
import path from 'path';
import {
  EXPORT_PATH,
  PROCESS_PATH,
  QUEUE_NAME,
} from 'src/common/constants/others';
import { getCurrentDateTime } from 'src/common/helpers/converter';
import {
  deleteFiles,
  extractFileBuffer,
  mergeFiles,
} from 'src/common/helpers/render';

@Processor(QUEUE_NAME.CLOSE_REPORT)
export class CloseReportProcessor {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly reportsService: ReportsService,
    private readonly medicinesService: MedicinesService,
    private readonly s3Service: S3Service,
    private readonly hieService: HieService,
    private readonly ethersService: EthersService,
    private readonly configService: ConfigService,
  ) {}

  @Process(`handle-${QUEUE_NAME.CLOSE_REPORT}`)
  async handle(job: Job) {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Close record request timeout after 5 minutes')),
        300000,
      ),
    );

    const task = (async () => {
      console.log('1 <<<<');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const record = job.data.record as PatientRecord;

      console.log('2 <<<<');
      // Export reports and prescription to PDF files
      const exportFilePaths: string[] = [];
      for (const serviceReport of record.serviceReports) {
        exportFilePaths.push(
          await this.reportsService.exportReport(serviceReport.identifier),
        );
      }
      console.log('3 <<<<');
      if (record.prescriptionIdentifier) {
        exportFilePaths.push(
          await this.medicinesService.exportPrescription(
            record.prescriptionIdentifier,
          ),
        );
      }

      console.log('4 <<<<');
      // Merge all files into a single PDF file
      const exportFileName = `record_${record.identifier}_${getCurrentDateTime()}.pdf`;
      const exportFilePath: string = path.resolve(
        PROCESS_PATH,
        `${EXPORT_PATH}${exportFileName}`,
      );
      console.log('5 <<<<');
      await mergeFiles(exportFilePaths, exportFilePath);

      console.log('6 <<<<');
      // Update record status
      record.status = true;
      record.exportFileName = exportFileName;
      await this.recordsService.update(record);

      console.log('7 <<<<');
      // Upload the file to S3
      await this.s3Service.uploadFile(
        exportFilePath,
        exportFileName,
        'application/pdf',
      );

      console.log('8 <<<<');
      // Push record to HIE to get transaction info
      const exportFileBuffer = await extractFileBuffer(exportFilePath);
      const hieFileInfo = await this.hieService.pushRecord(
        {
          hospitalIdentifier: this.configService.getOrThrow(
            'HOSPITAL_IDENTIFIER',
          ),
          patientIdentifier: record.patientIdentifier,
        },
        exportFileBuffer,
      );
      if (!hieFileInfo) return;

      console.log('9 <<<<');
      // Send transaction to blockchain
      await this.ethersService.sendTransaction(
        hieFileInfo.fileId,
        hieFileInfo.fileHash,
        hieFileInfo.fileSignature,
      );

      console.log('10 <<<<');
      // Clean up temporary files
      exportFilePaths.push(exportFilePath);
      await deleteFiles(exportFilePaths);
    })();

    try {
      await Promise.race([task, timeout]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      /* empty */
    }
  }
}
