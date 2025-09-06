import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('health_insurances')
export class HealthInsurance {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ name: 'object_type' })
  objectType: string;

  @Column({ name: 'registered_hospital' })
  registeredHospital: string;

  @Column({ name: 'authority_place' })
  authorityPlace: string;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: string;

  @Column({ name: 'expired_date', type: 'date' })
  expiredDate: string;

  // @OneToOne(() => User, (user) => user.healthInsurance)
  // user: User;
}
