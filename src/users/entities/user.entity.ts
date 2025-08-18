import { HealthInsurance } from 'src/health-insurances/entities/health-insurance.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column()
  telecom: string;

  @Column()
  email: string;

  @Column()
  gender: string;

  @Column({ name: 'birth_date' })
  birthDate: string;

  @Column()
  photo: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ name: 'health_insurance_identity' })
  healthInsuranceIdentifier: number;

  @OneToOne(() => HealthInsurance, (healthInsurance) => healthInsurance.user)
  @JoinColumn({
    name: 'health_insurance_identity',
    referencedColumnName: 'identifier',
  })
  healthInsurance: HealthInsurance;
}
