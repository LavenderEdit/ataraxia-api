import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUserEntityAndAddLeaderboard1770862075743 implements MigrationInterface {
    name = 'RefactorUserEntityAndAddLeaderboard1770862075743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_user_achievements_user\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastActiveAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`fullName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`experience\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`pomodorosCompleted\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastActiveDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3413c626ff3ba38d88649bea80\` ON \`users\` (\`experience\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_16baf58bd54941cff5cc803ccd\` ON \`users\` (\`pomodorosCompleted\`)`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_3ac6bc9da3e8a56f3f7082012dd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_3ac6bc9da3e8a56f3f7082012dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_16baf58bd54941cff5cc803ccd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3413c626ff3ba38d88649bea80\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastActiveDate\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`pomodorosCompleted\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`experience\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fullName\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastActiveAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_user_achievements_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
