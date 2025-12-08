import { AssessmentResult } from '@modules/assessments/entities/assessment-result.entity';
import { PatientRecord } from '@modules/records/entities/patient-record.entity';
import { Service } from 'src/modules/billing/entities/service.entity';
import { Physician } from 'src/modules/users/entities/physician.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DiagnosisReport } from './diagnosis-report.entity';
import { ImagingReport } from './imaging-report.entity';
import { LaboratoryReport } from './laboratory-report.entity';

@Entity('service_reports')
export class ServiceReport {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ default: '' })
  category: string;

  @Column({ default: '' })
  method: string;

  @Column({ default: '' })
  request: string;

  @Column({ type: 'boolean', default: false }) // true ~ completed
  status: boolean;

  @Column({
    name: 'effective_time',
    type: 'date',
    default: () => "'1000-01-01'",
  })
  effectiveTime: string;

  @Column({
    name: 'record_time',
    type: 'datetime',
    default: () => "'1000-01-01 00:00:00'",
  })
  recordedTime: string;

  @Column({ name: 'patient_record_identifier'})
  patientRecordIdentifier: number;

  @ManyToOne(
    () => PatientRecord,
    (patientRecord) => patientRecord.serviceReports,
  )
  @JoinColumn({
    name: 'patient_record_identifier',
    referencedColumnName: 'identifier',
  })
  patientRecord: PatientRecord;

  @Column({ name: 'service_identifier' })
  serviceIdentifier: number;

  @ManyToOne(() => Service, (service) => service.serviceReports)
  @JoinColumn({
    name: 'service_identifier',
    referencedColumnName: 'identifier',
  })
  service: Service;

  @OneToMany(
    () => AssessmentResult,
    (assessmentResult) => assessmentResult.serviceReport,
  )
  assessmentResults: AssessmentResult[];

  @Column({ name: 'performer_identifier', type: 'bigint', unsigned: true, nullable: true })
  performerIdentifier: number;

  @ManyToOne(() => Physician, (performer) => performer.performedServiceReports)
  @JoinColumn({
    name: 'performer_identifier',
    referencedColumnName: 'identifier',
  })
  performer: Physician;

  @Column({ name: 'reporter_identifier', type: 'bigint', unsigned: true, nullable: true })
  reporterIdentifier: number;

  @ManyToOne(() => Physician, (reporter) => reporter.reportedServiceReports)
  @JoinColumn({
    name: 'reporter_identifier',
    referencedColumnName: 'identifier',
  })
  reporter: Physician;

  @Column({ name: 'requester_identifier', type: 'bigint', unsigned: true, nullable: true })
  requesterIdentifier: number;

  @ManyToOne(() => Physician, (requester) => requester.requestedServiceReports)
  @JoinColumn({
    name: 'requester_identifier',
    referencedColumnName: 'identifier',
  })
  requester: Physician;

  @OneToOne(
    () => DiagnosisReport,
    (diagnosisReport) => diagnosisReport.serviceReport,
    { cascade: true },
  )
  diagnosisReport: DiagnosisReport;

  @OneToOne(
    () => LaboratoryReport,
    (laboratoryReport) => laboratoryReport.serviceReport,
    { cascade: true },
  )
  laboratoryReport: LaboratoryReport;

  @OneToOne(
    () => ImagingReport,
    (imagingReport) => imagingReport.serviceReport,
    { cascade: true },
  )
  imagingReport: ImagingReport;

  isPaid?: boolean;
}
