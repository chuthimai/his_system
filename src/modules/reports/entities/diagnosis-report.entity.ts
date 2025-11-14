import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { ServiceReport } from './service-report.entity';

@Entity('diagnosis_reports')
export class DiagnosisReport {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => ServiceReport)
  @JoinColumn({ name: 'identifier' })
  serviceReport: ServiceReport;

  @Column({ default: '' })
  severity: string;

  @Column({ default: '', length: 10000 })
  conclusion: string;
}
