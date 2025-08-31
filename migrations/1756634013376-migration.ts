import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1756634013376 implements MigrationInterface {
  name = 'Migration1756634013376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`health_insurances\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`object_type\` varchar(255) NOT NULL, \`registered_hospital\` varchar(255) NOT NULL, \`authority_place\` varchar(255) NOT NULL, \`effective_date\` date NOT NULL, \`expired_date\` date NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shifts\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`staffs\` (\`identifier\` int NOT NULL, \`address\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`qualifications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`specialty\` varchar(255) NOT NULL, \`issuer\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`effective_date\` date NOT NULL, \`expired_date\` date NOT NULL, \`physician_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specialties\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`contact\` varchar(255) NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`medications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`dose_form\` varchar(255) NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`prescribed_medications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`dose_instruction\` varchar(255) NOT NULL, \`note\` varchar(255) NULL, \`medication_identifier\` int NOT NULL, \`prescription_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`prescriptions\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`create_time\` datetime NOT NULL, \`physician_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`service_reports\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`category\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 0, \`effective_time\` date NOT NULL, \`record_time\` datetime NOT NULL, \`service_identifier\` int NOT NULL, \`performer_identifier\` int NOT NULL, \`requester_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`physicians\` (\`identifier\` int NOT NULL, \`specialty_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`appointments\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL DEFAULT 1, \`reason\` varchar(255) NULL, \`cancellation_date\` varchar(255) NULL, \`staff_work_schedule_identifier\` int NOT NULL, \`physician_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`staff_work_schedules\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`duty\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`work_schedule_identifier\` int NOT NULL, \`staff_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`work_schedules\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`location_identifier\` int NOT NULL, \`shift_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`locations\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`parent_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_categories\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`parent_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_results\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`assessment_item_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_items\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`service_identifier\` int NOT NULL, \`assessment_category_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`detail_description\` varchar(255) NULL, \`price\` int NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`location_identifier\` int NOT NULL, UNIQUE INDEX \`REL_871b56c7f1d7db3475bec0e5eb\` (\`location_identifier\`), PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoice_services\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`invoice_identifier\` int NOT NULL, \`service_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoices\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`currency\` varchar(255) NOT NULL, \`copayment_waiver\` int NOT NULL, \`total_gross\` int NOT NULL, \`status\` tinyint NOT NULL DEFAULT 0, \`created_time\` datetime NOT NULL, \`patient_record_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`patient_records\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL DEFAULT 0, \`created_time\` datetime NOT NULL, \`prescription_identifier\` int NOT NULL, \`patient_identifier\` int NOT NULL, UNIQUE INDEX \`REL_45755bf358c122397004dfc714\` (\`prescription_identifier\`), PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`telecom\` varchar(255) NULL, \`email\` varchar(255) NULL, \`gender\` tinyint NOT NULL, \`birth_date\` date NOT NULL, \`photo\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`health_insurance_identity\` int NOT NULL, UNIQUE INDEX \`REL_79a90b964e495a6de20d6c07da\` (\`health_insurance_identity\`), PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`laboratory_reports\` (\`identifier\` int NOT NULL, \`interpretation\` varchar(255) NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specimens\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`condition\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 0, \`received_time\` datetime NOT NULL, \`laboratory_report_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`images\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`endpoint\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`modality\` varchar(255) NOT NULL, \`received_time\` datetime NOT NULL, \`imaging_report_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`imaging_reports\` (\`identifier\` int NOT NULL, \`focus\` varchar(255) NOT NULL, \`interpretation\` varchar(255) NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`diagnosis_reports\` (\`identifier\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`severity\` varchar(255) NOT NULL, \`conclusion\` varchar(255) NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`measurement_indicator\` (\`identifier\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`minimum\` int NOT NULL, \`maximum\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_questions\` (\`identifier\` int NOT NULL, \`detail_description\` varchar(255) NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoices\` CHANGE \`copayment_waiver\` \`copayment_waiver\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`images\` DROP COLUMN \`modality\``);
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD \`modality\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_1382303f5d3ee6de34c9d32bc9b\` FOREIGN KEY (\`identifier\`) REFERENCES \`users\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`qualifications\` ADD CONSTRAINT \`identifier\` FOREIGN KEY (\`physician_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescribed_medications\` ADD CONSTRAINT \`FK_f58ea44867a0d82134b5a36192f\` FOREIGN KEY (\`medication_identifier\`) REFERENCES \`medications\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescribed_medications\` ADD CONSTRAINT \`FK_3c1d4a3d719f4e42bc52842a541\` FOREIGN KEY (\`prescription_identifier\`) REFERENCES \`prescriptions\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescriptions\` ADD CONSTRAINT \`FK_b3aa8be890b1189af3de52b1cd2\` FOREIGN KEY (\`physician_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_2aaa3e67d352cb99ef671ae49bf\` FOREIGN KEY (\`service_identifier\`) REFERENCES \`services\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_ece1dafc30c9b3abf0a3becddbc\` FOREIGN KEY (\`performer_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_a3e6983b912c644a6a0ce8ca0f8\` FOREIGN KEY (\`requester_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_4ad3f4ea04e9e78e87097d79198\` FOREIGN KEY (\`identifier\`) REFERENCES \`staffs\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_61d4b65e1c463431eb038174e9f\` FOREIGN KEY (\`specialty_identifier\`) REFERENCES \`specialties\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_797750ae8cb1be1d7fc780c276c\` FOREIGN KEY (\`staff_work_schedule_identifier\`) REFERENCES \`staff_work_schedules\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_ff9f7764b1c07bc695b271547ec\` FOREIGN KEY (\`physician_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` ADD CONSTRAINT \`FK_1107d2a576bd0d26a4f62c1cd89\` FOREIGN KEY (\`work_schedule_identifier\`) REFERENCES \`work_schedules\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` ADD CONSTRAINT \`FK_62c026a1b7dff153314707a141f\` FOREIGN KEY (\`staff_identifier\`) REFERENCES \`staffs\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`work_schedules\` ADD CONSTRAINT \`FK_a8f8a2e51843938c12048a087fe\` FOREIGN KEY (\`location_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`work_schedules\` ADD CONSTRAINT \`FK_4cc885a4018af9ca633ceba4cc0\` FOREIGN KEY (\`shift_identifier\`) REFERENCES \`shifts\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`locations\` ADD CONSTRAINT \`FK_402157d62724fef65e3264a0825\` FOREIGN KEY (\`parent_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_categories\` ADD CONSTRAINT \`FK_2e36983dc7caf80c65f0c2abfde\` FOREIGN KEY (\`parent_identifier\`) REFERENCES \`assessment_categories\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` ADD CONSTRAINT \`FK_525815ae103014a03c19b9a018a\` FOREIGN KEY (\`service_identifier\`) REFERENCES \`services\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` ADD CONSTRAINT \`FK_0c64344d82cb395772f242b8376\` FOREIGN KEY (\`assessment_category_identifier\`) REFERENCES \`assessment_categories\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_871b56c7f1d7db3475bec0e5ebe\` FOREIGN KEY (\`location_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice_services\` ADD CONSTRAINT \`FK_d51a09f085b308edc5b9eb0e54b\` FOREIGN KEY (\`invoice_identifier\`) REFERENCES \`invoices\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice_services\` ADD CONSTRAINT \`FK_958e6ba4fc9840bac57a4d44fbd\` FOREIGN KEY (\`service_identifier\`) REFERENCES \`services\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoices\` ADD CONSTRAINT \`FK_90e26bcc44b0e9a65fe87a6b0ab\` FOREIGN KEY (\`patient_record_identifier\`) REFERENCES \`patient_records\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` ADD CONSTRAINT \`FK_45755bf358c122397004dfc7143\` FOREIGN KEY (\`prescription_identifier\`) REFERENCES \`prescriptions\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` ADD CONSTRAINT \`FK_d1e43a4a3659fe9dd87379d4f62\` FOREIGN KEY (\`patient_identifier\`) REFERENCES \`users\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_79a90b964e495a6de20d6c07da9\` FOREIGN KEY (\`health_insurance_identity\`) REFERENCES \`health_insurances\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`laboratory_reports\` ADD CONSTRAINT \`FK_ce374e15b96544ccc16ecad7745\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specimens\` ADD CONSTRAINT \`FK_81163b14176adef60694ff5bf08\` FOREIGN KEY (\`laboratory_report_identifier\`) REFERENCES \`laboratory_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD CONSTRAINT \`FK_34c99aff20395c00f1d8b9a124a\` FOREIGN KEY (\`imaging_report_identifier\`) REFERENCES \`imaging_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`imaging_reports\` ADD CONSTRAINT \`FK_50d496e9fbf1e709d77572e3b7a\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`diagnosis_reports\` ADD CONSTRAINT \`FK_ae98034c39fcbe46e5dd54e6619\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`measurement_indicator\` ADD CONSTRAINT \`FK_39f9b9a72468a9cf7fda08f5ae7\` FOREIGN KEY (\`identifier\`) REFERENCES \`assessment_items\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_questions\` ADD CONSTRAINT \`FK_82cefc0bc184396c0c046887e0f\` FOREIGN KEY (\`identifier\`) REFERENCES \`assessment_items\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`assessment_questions\` DROP FOREIGN KEY \`FK_82cefc0bc184396c0c046887e0f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`measurement_indicator\` DROP FOREIGN KEY \`FK_39f9b9a72468a9cf7fda08f5ae7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`diagnosis_reports\` DROP FOREIGN KEY \`FK_ae98034c39fcbe46e5dd54e6619\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`imaging_reports\` DROP FOREIGN KEY \`FK_50d496e9fbf1e709d77572e3b7a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_34c99aff20395c00f1d8b9a124a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specimens\` DROP FOREIGN KEY \`FK_81163b14176adef60694ff5bf08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`laboratory_reports\` DROP FOREIGN KEY \`FK_ce374e15b96544ccc16ecad7745\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_79a90b964e495a6de20d6c07da9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` DROP FOREIGN KEY \`FK_d1e43a4a3659fe9dd87379d4f62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` DROP FOREIGN KEY \`FK_45755bf358c122397004dfc7143\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoices\` DROP FOREIGN KEY \`FK_90e26bcc44b0e9a65fe87a6b0ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice_services\` DROP FOREIGN KEY \`FK_958e6ba4fc9840bac57a4d44fbd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoice_services\` DROP FOREIGN KEY \`FK_d51a09f085b308edc5b9eb0e54b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_871b56c7f1d7db3475bec0e5ebe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` DROP FOREIGN KEY \`FK_0c64344d82cb395772f242b8376\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` DROP FOREIGN KEY \`FK_525815ae103014a03c19b9a018a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_categories\` DROP FOREIGN KEY \`FK_2e36983dc7caf80c65f0c2abfde\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_402157d62724fef65e3264a0825\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`work_schedules\` DROP FOREIGN KEY \`FK_4cc885a4018af9ca633ceba4cc0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`work_schedules\` DROP FOREIGN KEY \`FK_a8f8a2e51843938c12048a087fe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` DROP FOREIGN KEY \`FK_62c026a1b7dff153314707a141f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` DROP FOREIGN KEY \`FK_1107d2a576bd0d26a4f62c1cd89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_ff9f7764b1c07bc695b271547ec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_797750ae8cb1be1d7fc780c276c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_61d4b65e1c463431eb038174e9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_4ad3f4ea04e9e78e87097d79198\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_a3e6983b912c644a6a0ce8ca0f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_ece1dafc30c9b3abf0a3becddbc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_2aaa3e67d352cb99ef671ae49bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescriptions\` DROP FOREIGN KEY \`FK_b3aa8be890b1189af3de52b1cd2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescribed_medications\` DROP FOREIGN KEY \`FK_3c1d4a3d719f4e42bc52842a541\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`prescribed_medications\` DROP FOREIGN KEY \`FK_f58ea44867a0d82134b5a36192f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`qualifications\` DROP FOREIGN KEY \`identifier\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_1382303f5d3ee6de34c9d32bc9b\``,
    );
    await queryRunner.query(`ALTER TABLE \`images\` DROP COLUMN \`modality\``);
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD \`modality\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoices\` CHANGE \`copayment_waiver\` \`copayment_waiver\` int NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`assessment_questions\``);
    await queryRunner.query(`DROP TABLE \`measurement_indicator\``);
    await queryRunner.query(`DROP TABLE \`diagnosis_reports\``);
    await queryRunner.query(`DROP TABLE \`imaging_reports\``);
    await queryRunner.query(`DROP TABLE \`images\``);
    await queryRunner.query(`DROP TABLE \`specimens\``);
    await queryRunner.query(`DROP TABLE \`laboratory_reports\``);
    await queryRunner.query(
      `DROP INDEX \`REL_79a90b964e495a6de20d6c07da\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_45755bf358c122397004dfc714\` ON \`patient_records\``,
    );
    await queryRunner.query(`DROP TABLE \`patient_records\``);
    await queryRunner.query(`DROP TABLE \`invoices\``);
    await queryRunner.query(`DROP TABLE \`invoice_services\``);
    await queryRunner.query(
      `DROP INDEX \`REL_871b56c7f1d7db3475bec0e5eb\` ON \`services\``,
    );
    await queryRunner.query(`DROP TABLE \`services\``);
    await queryRunner.query(`DROP TABLE \`assessment_items\``);
    await queryRunner.query(`DROP TABLE \`assessment_results\``);
    await queryRunner.query(`DROP TABLE \`assessment_categories\``);
    await queryRunner.query(`DROP TABLE \`locations\``);
    await queryRunner.query(`DROP TABLE \`work_schedules\``);
    await queryRunner.query(`DROP TABLE \`staff_work_schedules\``);
    await queryRunner.query(`DROP TABLE \`appointments\``);
    await queryRunner.query(`DROP TABLE \`physicians\``);
    await queryRunner.query(`DROP TABLE \`service_reports\``);
    await queryRunner.query(`DROP TABLE \`prescriptions\``);
    await queryRunner.query(`DROP TABLE \`prescribed_medications\``);
    await queryRunner.query(`DROP TABLE \`medications\``);
    await queryRunner.query(`DROP TABLE \`specialties\``);
    await queryRunner.query(`DROP TABLE \`qualifications\``);
    await queryRunner.query(`DROP TABLE \`staffs\``);
    await queryRunner.query(`DROP TABLE \`shifts\``);
    await queryRunner.query(`DROP TABLE \`health_insurances\``);
  }
}
