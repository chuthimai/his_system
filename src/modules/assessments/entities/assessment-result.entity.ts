import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssessmentItem } from './assessment-item.entity';

@Entity('assessment_results')
export class AssessmentResult {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

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
}
