import { Physician } from 'src/users/entities/physician.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  contact: string;

  @OneToMany(() => Physician, (physician) => physician.specialty)
  physicians: Physician[];
}
