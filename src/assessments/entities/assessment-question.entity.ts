import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AssessmentItem } from './assessment-item.entity';

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => AssessmentItem, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  assessmentItem: AssessmentItem;

  @Column({ name: 'detail_description', nullable: true })
  detailDescription: string;
}
