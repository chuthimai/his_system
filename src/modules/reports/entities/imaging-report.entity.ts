import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ServiceReport } from './service-report.entity';
import { Image } from './image.entity';

@Entity('imaging_reports')
export class ImagingReport {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => ServiceReport, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  serviceReport: ServiceReport;

  @Column()
  focus: string;

  @Column()
  interpretation: string;

  @OneToMany(() => Image, (image) => image.imagingReport)
  images: Image[];
}
