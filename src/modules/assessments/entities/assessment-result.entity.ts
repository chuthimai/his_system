import { ServiceReport } from '@modules/reports/entities/service-report.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AssessmentItem } from './assessment-item.entity';

@Entity('assessment_results')
export class AssessmentResult {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  value: string;

  @Column({ name: 'assessment_item_identifier' })
  assessmentItemIdentifier: number;

  @OneToMany(
    () => AssessmentItem,
    (assessmentItem) => assessmentItem.assessmentResults,
  )
  @JoinColumn({
    name: 'assessment_item_identifier',
    referencedColumnName: 'identifier',
  })
  assessmentItem: AssessmentItem;

  @Column({ name: 'service_report_identifier' })
  serviceReportIdentifier: number;

  @ManyToOne(
    () => ServiceReport,
    (serviceReport) => serviceReport.assessmentResults,
  )
  @JoinColumn({
    name: 'service_report_identifier',
    referencedColumnName: 'identifier',
  })
  serviceReport: ServiceReport;
}
