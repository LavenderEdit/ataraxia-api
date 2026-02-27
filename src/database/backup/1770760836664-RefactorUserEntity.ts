import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUserEntity1770760836664 implements MigrationInterface {
    name = 'RefactorUserEntity1770760836664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user_achievements');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('user_achievements', fk);
            }
        }

        try {
            await queryRunner.query(`DROP INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\``);
        } catch (e) {
        }

        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);

        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`achievementId\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`achievementId\` varchar(36) NULL`);

        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\` (\`userId\`, \`achievementId\`)`);

        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_6a5a5816f54d0044ba5f3dc2b74\` FOREIGN KEY (\`achievementId\`) REFERENCES \`achievements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_user_achievements_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user_achievements');
        if (table) {
            for (const fk of table.foreignKeys) {
                await queryRunner.dropForeignKey('user_achievements', fk);
            }
        }

        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`achievementId\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`achievementId\` int NULL`);
    }
}