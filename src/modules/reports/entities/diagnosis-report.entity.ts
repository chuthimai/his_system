import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ServiceReport } from './service-report.entity';

@Entity('diagnosis_reports')
export class DiagnosisReport {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => ServiceReport, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  serviceReport: ServiceReport;

  @Column()
  type: string;

  @Column()
  severity: string;

  @Column()
  conclusion: string;
}
