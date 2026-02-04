import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAchievements1770230045130 implements MigrationInterface {
    name = 'AddAchievements1770230045130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_achievements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`achievementId\` int NULL, UNIQUE INDEX \`IDX_c1acd69cf91b1e353634c152dd\` (\`userId\`, \`achievementId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`achievements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`driveFileId\` varchar(255) NOT NULL, \`type\` enum ('streak', 'pomodoro_count') NOT NULL DEFAULT 'streak', \`threshold\` int NOT NULL, UNIQUE INDEX \`IDX_cd74882f69ff37d7330e89c63d\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_3ac6bc9da3e8a56f3f7082012dd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_6a5a5816f54d0044ba5f3dc2b74\` FOREIGN KEY (\`achievementId\`) REFERENCES \`achievements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_6a5a5816f54d0044ba5f3dc2b74\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_3ac6bc9da3e8a56f3f7082012dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_cd74882f69ff37d7330e89c63d\` ON \`achievements\``);
        await queryRunner.query(`DROP TABLE \`achievements\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\``);
        await queryRunner.query(`DROP TABLE \`user_achievements\``);
    }

}
