import { Physician } from 'src/modules/users/entities/physician.entity';
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

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: string;

  @Column({ name: 'expired_date', type: 'date', nullable: true })
  expiredDate: string;

  @Column({ name: 'physician_identifier', type: 'bigint', unsigned: true })
  physicianIdentifier: number;

  @ManyToOne(() => Physician, (physician) => physician.qualifications)
  @JoinColumn({
    name: 'physician_identifier',
    referencedColumnName: 'identifier',
  })
  physician: Physician;
}
