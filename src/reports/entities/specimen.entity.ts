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

  @Column()
  type: string;

  @Column()
  condition: string;

  @Column()
  status: boolean;

  @Column({ name: 'received_time' })
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
