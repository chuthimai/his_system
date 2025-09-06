import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AssessmentItem } from './assessment-item.entity';

@Entity('measurement_indicator')
export class MeasurementIndicator {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => AssessmentItem, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  assessmentItem: AssessmentItem;

  @Column()
  type: string;

  @Column()
  unit: string;

  @Column()
  minimum: number;

  @Column()
  maximum: number;
}
