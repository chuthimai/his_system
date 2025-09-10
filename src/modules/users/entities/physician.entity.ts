import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Qualification } from 'src/modules/specializations/entities/qualification.entity';
import { Specialty } from 'src/modules/specializations/entities/specialty.entity';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Prescription } from 'src/modules/medicines/entities/prescription.entity';
import { ServiceReport } from 'src/modules/reports/entities/service-report.entity';

@Entity('physicians')
export class Physician {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => Staff, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  staff?: Staff;

  name?: string;
  telecom?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  photo?: string;
  password?: string;
  role: string;
  address?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;

  @OneToMany(() => Qualification, (qualification) => qualification.physician)
  qualifications: Qualification[];

  @Column({ name: 'specialty_identifier', nullable: true })
  specialtyIdentifier: number;

  @ManyToOne(() => Specialty, (specialty) => specialty.physicians)
  @JoinColumn({
    name: 'specialty_identifier',
    referencedColumnName: 'identifier',
  })
  specialty: Specialty;

  @OneToMany(() => Appointment, (appointment) => appointment.physician)
  appointments: Appointment[];

  @OneToMany(() => Prescription, (prescription) => prescription.physician)
  prescriptions: Prescription[];

  @OneToMany(() => ServiceReport, (serviceReport) => serviceReport.performer)
  servicePerformanceReports: ServiceReport[];

  @OneToMany(() => ServiceReport, (serviceReport) => serviceReport.requester)
  serviceRequestReports: ServiceReport[];
}
