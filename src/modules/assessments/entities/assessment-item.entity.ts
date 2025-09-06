import { Service } from 'src/modules/billing/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssessmentCategory } from './assessment-category.entity';
import { AssessmentResult } from './assessment-result.entity';

@Entity('assessment_items')
export class AssessmentItem {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ name: 'service_identifier' })
  serviceIdentifier: number;

  @ManyToOne(() => Service, (service) => service.assessmentItems)
  @JoinColumn({
    name: 'service_identifier',
    referencedColumnName: 'identifier',
  })
  service: Service;

  @Column({ name: 'assessment_category_identifier' })
  assessmentCategoryIdentifier: number;

  @ManyToOne(
    () => AssessmentCategory,
    (assessmentCategory) => assessmentCategory.assessmentItems,
  )
  @JoinColumn({
    name: 'assessment_category_identifier',
    referencedColumnName: 'identifier',
  })
  assessmentCategory: AssessmentCategory;

  @OneToMany(
    () => AssessmentResult,
    (assessmentResult) => assessmentResult.assessmentItem,
  )
  assessmentResults: AssessmentResult[];
}
