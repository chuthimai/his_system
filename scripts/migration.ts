import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765095362961 implements MigrationInterface {
  name = 'Migration1765095362961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`invoice_services\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`invoice_identifier\` int NOT NULL, \`service_identifier\` int NOT NULL, \`price\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoices\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`currency\` varchar(255) NOT NULL DEFAULT 'VND', \`total\` int NOT NULL DEFAULT '0', \`status\` tinyint NOT NULL DEFAULT 0, \`payment_code\` varchar(255) NULL, \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`paid_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`patient_record_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shifts\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`work_schedules\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`shift_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`identifier\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`telecom\` varchar(255) NULL, \`birth_date\` date NOT NULL, \`gender\` tinyint NOT NULL, \`address\` varchar(255) NOT NULL, \`photo\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`device_token\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`appointments\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL DEFAULT 1, \`reason\` varchar(255) NULL, \`cancellation_date\` date NULL, \`work_schedule_identifier\` int NOT NULL, \`physician_identifier\` bigint UNSIGNED NULL, \`user_identifier\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`qualifications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`specialty\` varchar(255) NOT NULL, \`issuer\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`effective_date\` date NOT NULL, \`expired_date\` date NULL, \`physician_identifier\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specialties\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`contact\` varchar(255) NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`physicians\` (\`identifier\` bigint UNSIGNED NOT NULL, \`specialty_identifier\` int NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`medications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`dose_form\` varchar(255) NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`prescribed_medications\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`dose_instruction\` varchar(255) NOT NULL, \`medication_identifier\` int NOT NULL, \`prescription_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`prescriptions\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`advice\` varchar(255) NOT NULL, \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`physician_identifier\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`patient_records\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL DEFAULT 0, \`having_referral_letter\` tinyint NOT NULL DEFAULT '0', \`having_heath_insurance\` tinyint NOT NULL DEFAULT '0', \`export_file_name\` varchar(255) NOT NULL DEFAULT '', \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`prescription_identifier\` int NULL, \`patient_identifier\` bigint UNSIGNED NOT NULL, UNIQUE INDEX \`REL_45755bf358c122397004dfc714\` (\`prescription_identifier\`), PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`diagnosis_reports\` (\`identifier\` int NOT NULL, \`severity\` varchar(255) NOT NULL DEFAULT '', \`conclusion\` varchar(10000) NOT NULL DEFAULT '', PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`images\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`endpoint\` varchar(255) NOT NULL, \`received_time\` datetime NOT NULL, \`imaging_report_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`imaging_reports\` (\`identifier\` int NOT NULL, \`focus\` varchar(255) NOT NULL DEFAULT '', \`interpretation\` varchar(10000) NOT NULL DEFAULT '', PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specimens\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL DEFAULT '', \`condition\` varchar(255) NOT NULL DEFAULT '', \`state\` varchar(255) NOT NULL DEFAULT '', \`status\` tinyint NOT NULL DEFAULT 0, \`received_time\` datetime NOT NULL DEFAULT '1000-01-01 00:00:00', \`laboratory_report_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`laboratory_reports\` (\`identifier\` int NOT NULL, \`interpretation\` varchar(10000) NOT NULL DEFAULT '', PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`service_reports\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`category\` varchar(255) NOT NULL DEFAULT '', \`method\` varchar(255) NOT NULL DEFAULT '', \`request\` varchar(255) NOT NULL DEFAULT '', \`status\` tinyint NOT NULL DEFAULT 0, \`effective_time\` date NOT NULL DEFAULT '1000-01-01', \`record_time\` datetime NOT NULL DEFAULT '1000-01-01 00:00:00', \`patient_record_identifier\` int NOT NULL, \`service_identifier\` int NOT NULL, \`performer_identifier\` bigint UNSIGNED NULL, \`reporter_identifier\` bigint UNSIGNED NULL, \`requester_identifier\` bigint UNSIGNED NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_results\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(10000) NOT NULL DEFAULT '', \`assessment_item_identifier\` int NOT NULL, \`service_report_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`measurement_items\` (\`identifier\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`minimum\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`maximum\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`assessment_items\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`service_identifier\` int NULL, \`parent_identifier\` int NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`detail_description\` varchar(255) NULL, \`price\` int NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`location_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`locations\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`parent_identifier\` int NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`staff_work_schedules\` (\`identifier\` int NOT NULL AUTO_INCREMENT, \`duty\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`work_schedule_identifier\` int NOT NULL, \`staff_identifier\` bigint UNSIGNED NOT NULL, \`location_identifier\` int NOT NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`staffs\` (\`identifier\` bigint UNSIGNED NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`start_date\` date NOT NULL, \`end_date\` date NULL, PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`,
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
      `ALTER TABLE \`work_schedules\` ADD CONSTRAINT \`FK_4cc885a4018af9ca633ceba4cc0\` FOREIGN KEY (\`shift_identifier\`) REFERENCES \`shifts\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_d060a224566068e6943574ead5f\` FOREIGN KEY (\`work_schedule_identifier\`) REFERENCES \`work_schedules\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_ff9f7764b1c07bc695b271547ec\` FOREIGN KEY (\`physician_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_11887440f4dd088549f4d4a2e4d\` FOREIGN KEY (\`user_identifier\`) REFERENCES \`users\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`qualifications\` ADD CONSTRAINT \`FK_1cea971c700318b79ce2d6a6dd4\` FOREIGN KEY (\`physician_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_4ad3f4ea04e9e78e87097d79198\` FOREIGN KEY (\`identifier\`) REFERENCES \`staffs\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_61d4b65e1c463431eb038174e9f\` FOREIGN KEY (\`specialty_identifier\`) REFERENCES \`specialties\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`patient_records\` ADD CONSTRAINT \`FK_45755bf358c122397004dfc7143\` FOREIGN KEY (\`prescription_identifier\`) REFERENCES \`prescriptions\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` ADD CONSTRAINT \`FK_d1e43a4a3659fe9dd87379d4f62\` FOREIGN KEY (\`patient_identifier\`) REFERENCES \`users\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`diagnosis_reports\` ADD CONSTRAINT \`FK_ae98034c39fcbe46e5dd54e6619\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` ADD CONSTRAINT \`FK_34c99aff20395c00f1d8b9a124a\` FOREIGN KEY (\`imaging_report_identifier\`) REFERENCES \`imaging_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`imaging_reports\` ADD CONSTRAINT \`FK_50d496e9fbf1e709d77572e3b7a\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specimens\` ADD CONSTRAINT \`FK_81163b14176adef60694ff5bf08\` FOREIGN KEY (\`laboratory_report_identifier\`) REFERENCES \`laboratory_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`laboratory_reports\` ADD CONSTRAINT \`FK_ce374e15b96544ccc16ecad7745\` FOREIGN KEY (\`identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_459a2528a57eb4cb1d340a77d85\` FOREIGN KEY (\`patient_record_identifier\`) REFERENCES \`patient_records\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_2aaa3e67d352cb99ef671ae49bf\` FOREIGN KEY (\`service_identifier\`) REFERENCES \`services\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_ece1dafc30c9b3abf0a3becddbc\` FOREIGN KEY (\`performer_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_09eb4986c6951ea5dbf15728688\` FOREIGN KEY (\`reporter_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` ADD CONSTRAINT \`FK_a3e6983b912c644a6a0ce8ca0f8\` FOREIGN KEY (\`requester_identifier\`) REFERENCES \`physicians\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_results\` ADD CONSTRAINT \`FK_6fbf90293e16439c7611abb09a7\` FOREIGN KEY (\`assessment_item_identifier\`) REFERENCES \`assessment_items\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_results\` ADD CONSTRAINT \`FK_bceebb3817c940ddf6eb5bd96f1\` FOREIGN KEY (\`service_report_identifier\`) REFERENCES \`service_reports\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`measurement_items\` ADD CONSTRAINT \`FK_b480b79d1e323d232e18403e3d7\` FOREIGN KEY (\`identifier\`) REFERENCES \`assessment_items\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` ADD CONSTRAINT \`FK_525815ae103014a03c19b9a018a\` FOREIGN KEY (\`service_identifier\`) REFERENCES \`services\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` ADD CONSTRAINT \`FK_3a9bea6758b24377cabd91af221\` FOREIGN KEY (\`parent_identifier\`) REFERENCES \`assessment_items\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_871b56c7f1d7db3475bec0e5ebe\` FOREIGN KEY (\`location_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`locations\` ADD CONSTRAINT \`FK_402157d62724fef65e3264a0825\` FOREIGN KEY (\`parent_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` ADD CONSTRAINT \`FK_1107d2a576bd0d26a4f62c1cd89\` FOREIGN KEY (\`work_schedule_identifier\`) REFERENCES \`work_schedules\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` ADD CONSTRAINT \`FK_62c026a1b7dff153314707a141f\` FOREIGN KEY (\`staff_identifier\`) REFERENCES \`staffs\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` ADD CONSTRAINT \`FK_b8c2ca9ab6fb5fe6a9f89bed972\` FOREIGN KEY (\`location_identifier\`) REFERENCES \`locations\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_1382303f5d3ee6de34c9d32bc9b\` FOREIGN KEY (\`identifier\`) REFERENCES \`users\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_1382303f5d3ee6de34c9d32bc9b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` DROP FOREIGN KEY \`FK_b8c2ca9ab6fb5fe6a9f89bed972\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` DROP FOREIGN KEY \`FK_62c026a1b7dff153314707a141f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_work_schedules\` DROP FOREIGN KEY \`FK_1107d2a576bd0d26a4f62c1cd89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_402157d62724fef65e3264a0825\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_871b56c7f1d7db3475bec0e5ebe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` DROP FOREIGN KEY \`FK_3a9bea6758b24377cabd91af221\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_items\` DROP FOREIGN KEY \`FK_525815ae103014a03c19b9a018a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`measurement_items\` DROP FOREIGN KEY \`FK_b480b79d1e323d232e18403e3d7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_results\` DROP FOREIGN KEY \`FK_bceebb3817c940ddf6eb5bd96f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assessment_results\` DROP FOREIGN KEY \`FK_6fbf90293e16439c7611abb09a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_a3e6983b912c644a6a0ce8ca0f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_09eb4986c6951ea5dbf15728688\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_ece1dafc30c9b3abf0a3becddbc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_2aaa3e67d352cb99ef671ae49bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_reports\` DROP FOREIGN KEY \`FK_459a2528a57eb4cb1d340a77d85\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`laboratory_reports\` DROP FOREIGN KEY \`FK_ce374e15b96544ccc16ecad7745\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specimens\` DROP FOREIGN KEY \`FK_81163b14176adef60694ff5bf08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`imaging_reports\` DROP FOREIGN KEY \`FK_50d496e9fbf1e709d77572e3b7a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_34c99aff20395c00f1d8b9a124a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`diagnosis_reports\` DROP FOREIGN KEY \`FK_ae98034c39fcbe46e5dd54e6619\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` DROP FOREIGN KEY \`FK_d1e43a4a3659fe9dd87379d4f62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient_records\` DROP FOREIGN KEY \`FK_45755bf358c122397004dfc7143\``,
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
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_61d4b65e1c463431eb038174e9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_4ad3f4ea04e9e78e87097d79198\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`qualifications\` DROP FOREIGN KEY \`FK_1cea971c700318b79ce2d6a6dd4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_11887440f4dd088549f4d4a2e4d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_ff9f7764b1c07bc695b271547ec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_d060a224566068e6943574ead5f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`work_schedules\` DROP FOREIGN KEY \`FK_4cc885a4018af9ca633ceba4cc0\``,
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
    await queryRunner.query(`DROP TABLE \`staffs\``);
    await queryRunner.query(`DROP TABLE \`staff_work_schedules\``);
    await queryRunner.query(`DROP TABLE \`locations\``);
    await queryRunner.query(`DROP TABLE \`services\``);
    await queryRunner.query(`DROP TABLE \`assessment_items\``);
    await queryRunner.query(`DROP TABLE \`measurement_items\``);
    await queryRunner.query(`DROP TABLE \`assessment_results\``);
    await queryRunner.query(`DROP TABLE \`service_reports\``);
    await queryRunner.query(`DROP TABLE \`laboratory_reports\``);
    await queryRunner.query(`DROP TABLE \`specimens\``);
    await queryRunner.query(`DROP TABLE \`imaging_reports\``);
    await queryRunner.query(`DROP TABLE \`images\``);
    await queryRunner.query(`DROP TABLE \`diagnosis_reports\``);
    await queryRunner.query(
      `DROP INDEX \`REL_45755bf358c122397004dfc714\` ON \`patient_records\``,
    );
    await queryRunner.query(`DROP TABLE \`patient_records\``);
    await queryRunner.query(`DROP TABLE \`prescriptions\``);
    await queryRunner.query(`DROP TABLE \`prescribed_medications\``);
    await queryRunner.query(`DROP TABLE \`medications\``);
    await queryRunner.query(`DROP TABLE \`physicians\``);
    await queryRunner.query(`DROP TABLE \`specialties\``);
    await queryRunner.query(`DROP TABLE \`qualifications\``);
    await queryRunner.query(`DROP TABLE \`appointments\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`work_schedules\``);
    await queryRunner.query(`DROP TABLE \`shifts\``);
    await queryRunner.query(`DROP TABLE \`invoices\``);
    await queryRunner.query(`DROP TABLE \`invoice_services\``);
  }
}
