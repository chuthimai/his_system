import { Physician } from 'src/users/entities/physician.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  contact: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => Physician, (physician) => physician.specialty)
  physicians: Physician[];
}
