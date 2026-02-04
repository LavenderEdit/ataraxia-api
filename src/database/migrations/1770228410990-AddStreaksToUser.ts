import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStreaksToUser1770228410990 implements MigrationInterface {
    name = 'AddStreaksToUser1770228410990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`currentStreak\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`longestStreak\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastActiveAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastActiveAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`longestStreak\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`currentStreak\``);
    }

}
