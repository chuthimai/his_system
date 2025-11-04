import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LaboratoryReport } from './laboratory-report.entity';

@Entity('specimens')
export class Specimen {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ default: '' })
  type: string;

  @Column({ default: '' })
  condition: string;

  @Column({ default: '' })
  state: string;

  @Column({ type: 'boolean', default: false }) // true ~ close?
  status: boolean;

  @Column({
    name: 'received_time',
    type: 'datetime',
    default: () => "'1000-01-01 00:00:00'",
  })
  receivedTime: string;

  @Column({ name: 'laboratory_report_identifier' })
  laboratoryReportIdentifier: number;

  @ManyToOne(
    () => LaboratoryReport,
    (laboratoryReport) => laboratoryReport.specimens,
  )
  @JoinColumn({
    name: 'laboratory_report_identifier',
    referencedColumnName: 'identifier',
  })
  laboratoryReport: LaboratoryReport;
}
