import { Physician } from 'src/users/entities/physician.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('qualifications')
export class Qualification {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column()
  specialty: string;

  @Column()
  issuer: string;

  @Column()
  type: string;

  @Column({ name: 'effective_date' })
  effectiveDate: string;

  @Column({ name: 'expired_date' })
  expiredDate: string;

  @Column({ name: 'physician_identifier' })
  physicianIdentifier: number;

  @ManyToOne(() => Physician, (physician) => physician.qualifications)
  @JoinColumn({
    name: 'physician_identifier',
    foreignKeyConstraintName: 'identifier',
  })
  physician: Physician;
}
