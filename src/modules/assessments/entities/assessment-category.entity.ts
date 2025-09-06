import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssessmentItem } from './assessment-item.entity';

@Entity('assessment_categories')
export class AssessmentCategory {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ name: 'parent_identifier' })
  parentIdentifier: number;

  @ManyToOne(
    () => AssessmentCategory,
    (assessmentCategory) => assessmentCategory.children,
  )
  @JoinColumn({
    name: 'parent_identifier',
    referencedColumnName: 'identifier',
  })
  parent: AssessmentCategory;

  @OneToMany(
    () => AssessmentCategory,
    (assessmentCategory) => assessmentCategory.parent,
  )
  children: AssessmentCategory[];

  @OneToMany(
    () => AssessmentItem,
    (assessmentItem) => assessmentItem.assessmentCategory,
  )
  assessmentItems: AssessmentItem[];
}
