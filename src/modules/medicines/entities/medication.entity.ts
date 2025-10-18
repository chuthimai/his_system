import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PrescribedMedication } from './prescribed-medication.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ name: 'dose_form' })
  doseForm: string;

  @OneToMany(
    () => PrescribedMedication,
    (prescribedMedication) => prescribedMedication.medication,
  )
  prescribedMedications: PrescribedMedication[];
}
