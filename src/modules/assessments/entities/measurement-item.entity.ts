import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { AssessmentItem } from './assessment-item.entity';

@Entity('measurement_items')
export class MeasurementItem {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => AssessmentItem, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  assessmentItem: AssessmentItem;

  @Column()
  type: string;

  @Column()
  unit: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  minimum: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  maximum: string;
}
