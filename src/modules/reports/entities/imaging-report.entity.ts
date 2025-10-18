import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Image } from './image.entity';
import { ServiceReport } from './service-report.entity';

@Entity('imaging_reports')
export class ImagingReport {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => ServiceReport, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  serviceReport: ServiceReport;

  @Column({ default: '' })
  focus: string;

  @Column({ default: '' })
  interpretation: string;

  @OneToMany(() => Image, (image) => image.imagingReport)
  images: Image[];
}
