import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { ServiceReport } from './service-report.entity';
import { Specimen } from './specimen.entity';

@Entity('laboratory_reports')
export class LaboratoryReport {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => ServiceReport)
  @JoinColumn({ name: 'identifier' })
  serviceReport: ServiceReport;

  @Column({ default: '', length: 10000 })
  interpretation: string;

  @OneToMany(() => Specimen, (specimen) => specimen.laboratoryReport)
  specimens: Specimen[];
}
