import { Service } from 'src/modules/billing/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AssessmentResult } from './assessment-result.entity';
import { MeasurementItem } from './measurement-item.entity';

@Entity('assessment_items')
export class AssessmentItem {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @OneToOne(
    () => MeasurementItem,
    (measurementItem) => measurementItem.assessmentItem,
  )
  measurementItem: MeasurementItem;

  @Column({ name: 'service_identifier', nullable: true })
  serviceIdentifier: number;

  @ManyToOne(() => Service, (service) => service.assessmentItems)
  @JoinColumn({
    name: 'service_identifier',
    referencedColumnName: 'identifier',
  })
  service: Service;

  @Column({ name: 'parent_identifier', nullable: true })
  parentIdentifier: number;

  @ManyToOne(() => AssessmentItem, (assessmentItem) => assessmentItem.children)
  @JoinColumn({
    name: 'parent_identifier',
    referencedColumnName: 'identifier',
  })
  parent: AssessmentItem;

  @OneToMany(() => AssessmentItem, (assessmentItem) => assessmentItem.parent)
  children: AssessmentItem[];

  @OneToMany(
    () => AssessmentResult,
    (assessmentResult) => assessmentResult.assessmentItem,
  )
  assessmentResults: AssessmentResult[];
}
