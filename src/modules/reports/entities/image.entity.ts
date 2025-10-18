import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ImagingReport } from './imaging-report.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  endpoint: string;

  @Column()
  comment: string;

  @Column()
  modality: string;

  @Column({ name: 'received_time', type: 'datetime' })
  receivedTime: string;

  @Column({ name: 'imaging_report_identifier' })
  imagingReportIdentifier: number;

  @ManyToOne(() => ImagingReport, (imagingReport) => imagingReport.images)
  @JoinColumn({
    name: 'imaging_report_identifier',
    referencedColumnName: 'identifier',
  })
  imagingReport: ImagingReport;
}
