import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'effective_date' })
  effectiveDate: string;

  @Column({ name: 'expired_date' })
  expiredDate: string;

  @OneToOne(() => User, (user) => user.healthInsurance)
  user: User;
}
