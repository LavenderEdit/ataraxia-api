import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserEntity1770167158203 implements MigrationInterface {
    name = 'FixUserEntity1770167158203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_92e67dc508c705dd66c94615576\``);
        await queryRunner.query(`CREATE TABLE \`timers\` (\`id\` varchar(36) NOT NULL, \`duration\` int NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'completed', \`startTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`endTime\` datetime NULL, \`tag\` varchar(255) NULL, \`userId\` varchar(255) NULL, \`taskId\` varchar(255) NULL, INDEX \`IDX_462356a1cbaef07bab0bf3627d\` (\`userId\`), INDEX \`IDX_0110ac4e8ee85325054f8b663f\` (\`taskId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(255) NULL, \`tag\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, INDEX \`IDX_166bd96559cb38595d392f75a3\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`focusDuration\` int NOT NULL DEFAULT '25', \`shortBreakDuration\` int NOT NULL DEFAULT '5', \`longBreakDuration\` int NOT NULL DEFAULT '15', \`autoStartBreaks\` tinyint NOT NULL DEFAULT 0, \`autoStartPomodoros\` tinyint NOT NULL DEFAULT 0, \`longBreakInterval\` int NOT NULL DEFAULT '4', \`theme\` varchar(255) NOT NULL DEFAULT 'light', \`soundEnabled\` tinyint NOT NULL DEFAULT 1, \`platform\` varchar(255) NOT NULL DEFAULT 'web', \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_37d340cad30f824af39808af12\` (\`userId\`, \`platform\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`isGuest\` tinyint NOT NULL DEFAULT 0, \`deviceId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`timers\` ADD CONSTRAINT \`FK_462356a1cbaef07bab0bf3627d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timers\` ADD CONSTRAINT \`FK_0110ac4e8ee85325054f8b663f5\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_166bd96559cb38595d392f75a35\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_92e67dc508c705dd66c94615576\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`settings\` ADD CONSTRAINT \`FK_9175e059b0a720536f7726a88c7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` DROP FOREIGN KEY \`FK_9175e059b0a720536f7726a88c7\``);
        await queryRunner.query(`ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_92e67dc508c705dd66c94615576\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_166bd96559cb38595d392f75a35\``);
        await queryRunner.query(`ALTER TABLE \`timers\` DROP FOREIGN KEY \`FK_0110ac4e8ee85325054f8b663f5\``);
        await queryRunner.query(`ALTER TABLE \`timers\` DROP FOREIGN KEY \`FK_462356a1cbaef07bab0bf3627d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_37d340cad30f824af39808af12\` ON \`settings\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
        await queryRunner.query(`DROP INDEX \`IDX_166bd96559cb38595d392f75a3\` ON \`tasks\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_0110ac4e8ee85325054f8b663f\` ON \`timers\``);
        await queryRunner.query(`DROP INDEX \`IDX_462356a1cbaef07bab0bf3627d\` ON \`timers\``);
        await queryRunner.query(`DROP TABLE \`timers\``);
        await queryRunner.query(`ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_92e67dc508c705dd66c94615576\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
