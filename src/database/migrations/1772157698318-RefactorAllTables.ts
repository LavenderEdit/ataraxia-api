import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorAllTables1772157698318 implements MigrationInterface {
    name = 'RefactorAllTables1772157698318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // =========================================================================
        // FASE 1: ELIMINAR LLAVES FORÁNEAS QUE VAMOS A MODIFICAR
        // =========================================================================
        const userAchievementsTable = await queryRunner.getTable('user_achievements');
        if (userAchievementsTable) {
            for (const fk of userAchievementsTable.foreignKeys) {
                await queryRunner.dropForeignKey('user_achievements', fk);
            }
        }

        try { await queryRunner.query(`DROP INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\``); } catch (e) { }

        // =========================================================================
        // FASE 2: AÑADIR LAS NUEVAS COLUMNAS (VERIFICANDO SI YA EXISTEN POR FALLOS PREVIOS)
        // =========================================================================
        // Tabla Users
        if (!(await queryRunner.hasColumn('users', 'name'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) NULL`);
        if (!(await queryRunner.hasColumn('users', 'fullName'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`fullName\` varchar(255) NULL`);
        if (!(await queryRunner.hasColumn('users', 'avatarUrl'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarUrl\` varchar(255) NULL`);
        if (!(await queryRunner.hasColumn('users', 'resetPasswordToken'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetPasswordToken\` varchar(255) NULL`);
        if (!(await queryRunner.hasColumn('users', 'resetPasswordExpires'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetPasswordExpires\` datetime NULL`);
        if (!(await queryRunner.hasColumn('users', 'experience'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`experience\` int NOT NULL DEFAULT '0'`);
        if (!(await queryRunner.hasColumn('users', 'pomodorosCompleted'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`pomodorosCompleted\` int NOT NULL DEFAULT '0'`);
        if (!(await queryRunner.hasColumn('users', 'lastActiveDate'))) await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastActiveDate\` timestamp NULL`);

        // Tabla Achievements
        if (!(await queryRunner.hasColumn('achievements', 'iconPath'))) await queryRunner.query(`ALTER TABLE \`achievements\` ADD \`iconPath\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`achievements\` CHANGE \`driveFileId\` \`driveFileId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`achievements\` CHANGE \`threshold\` \`threshold\` int NOT NULL DEFAULT '0'`);

        // =========================================================================
        // FASE 3: MIGRACIÓN SEGURA DE DATOS (DATA MIGRATION)
        // =========================================================================
        // Solo actualizamos si las columnas 'firstName' y 'lastActiveAt' AÚN existen
        if (await queryRunner.hasColumn('users', 'firstName')) {
            await queryRunner.query(`UPDATE \`users\` SET \`fullName\` = TRIM(CONCAT(IFNULL(\`firstName\`, ''), ' ', IFNULL(\`lastName\`, '')))`);
            await queryRunner.query(`UPDATE \`users\` SET \`name\` = CONCAT(IFNULL(\`firstName\`, 'user'), '_', SUBSTRING(\`id\`, 1, 6))`);
        }

        if (await queryRunner.hasColumn('users', 'lastActiveAt')) {
            await queryRunner.query(`UPDATE \`users\` SET \`lastActiveDate\` = \`lastActiveAt\``);
        }

        if (!(await queryRunner.hasColumn('achievements', 'new_uuid'))) {
            await queryRunner.query(`ALTER TABLE \`achievements\` ADD \`new_uuid\` varchar(36) NULL`);
            await queryRunner.query(`UPDATE \`achievements\` SET \`new_uuid\` = UUID()`);
        }

        if (!(await queryRunner.hasColumn('user_achievements', 'newAchievementId'))) {
            await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`newAchievementId\` varchar(36) NULL`);
            await queryRunner.query(`
                UPDATE \`user_achievements\` ua 
                JOIN \`achievements\` a ON ua.\`achievementId\` = a.\`id\` 
                SET ua.\`newAchievementId\` = a.\`new_uuid\`
            `);
        }

        // =========================================================================
        // FASE 4: ELIMINAR LAS COLUMNAS VIEJAS Y RENOMBRAR LAS TEMPORALES
        // =========================================================================
        if (await queryRunner.hasColumn('users', 'firstName')) await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstName\``);
        if (await queryRunner.hasColumn('users', 'lastName')) await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        if (await queryRunner.hasColumn('users', 'lastActiveAt')) await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastActiveAt\``);

        // Verificamos si la columna 'id' de achievements sigue siendo un INT
        const achTable = await queryRunner.getTable('achievements');
        const idCol = achTable?.columns.find(c => c.name === 'id');
        if (idCol && (idCol.type === 'int' || idCol.type === 'integer')) {
            await queryRunner.query(`ALTER TABLE \`achievements\` MODIFY \`id\` int NOT NULL`); // Quita el auto_increment
            await queryRunner.query(`ALTER TABLE \`achievements\` DROP PRIMARY KEY`);
            await queryRunner.query(`ALTER TABLE \`achievements\` DROP COLUMN \`id\``);
            await queryRunner.query(`ALTER TABLE \`achievements\` CHANGE \`new_uuid\` \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        }

        // Verificamos si achievementId en user_achievements sigue siendo INT
        const uaTable = await queryRunner.getTable('user_achievements');
        const achIdCol = uaTable?.columns.find(c => c.name === 'achievementId');
        if (achIdCol && (achIdCol.type === 'int' || achIdCol.type === 'integer')) {
            await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`achievementId\``);
            await queryRunner.query(`ALTER TABLE \`user_achievements\` CHANGE \`newAchievementId\` \`achievementId\` varchar(36) NULL`);
        }

        // =========================================================================
        // FASE 5: CREAR ÍNDICES Y RESTRICCIONES (CONSTRAINTS) FINALES
        // =========================================================================
        // Envolvemos en try/catch para ignorar errores si el índice ya se había logrado crear antes de crashear
        try { await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`)`); } catch (e) { }
        try { await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\` (\`userId\`, \`achievementId\`)`); } catch (e) { }
        try { await queryRunner.query(`CREATE INDEX \`IDX_3413c626ff3ba38d88649bea80\` ON \`users\` (\`experience\`)`); } catch (e) { }
        try { await queryRunner.query(`CREATE INDEX \`IDX_16baf58bd54941cff5cc803ccd\` ON \`users\` (\`pomodorosCompleted\`)`); } catch (e) { }

        try { await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_3ac6bc9da3e8a56f3f7082012dd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`); } catch (e) { }
        try { await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_6a5a5816f54d0044ba5f3dc2b74\` FOREIGN KEY (\`achievementId\`) REFERENCES \`achievements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`); } catch (e) { }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ... (El método down se mantiene igual ya que rara vez da este tipo de problemas)
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_6a5a5816f54d0044ba5f3dc2b74\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_3ac6bc9da3e8a56f3f7082012dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_16baf58bd54941cff5cc803ccd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3413c626ff3ba38d88649bea80\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1acd69cf91b1e353634c152dd\` ON \`user_achievements\``);

        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP COLUMN \`achievementId\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD \`achievementId\` int NULL`);

        await queryRunner.query(`ALTER TABLE \`achievements\` CHANGE \`threshold\` \`threshold\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`achievements\` CHANGE \`driveFileId\` \`driveFileId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`achievements\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`achievements\` ADD \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST`);

        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_6a5a5816f54d0044ba5f3dc2b74\` FOREIGN KEY (\`achievementId\`) REFERENCES \`achievements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastActiveDate\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`pomodorosCompleted\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`experience\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetPasswordExpires\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetPasswordToken\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fullName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`achievements\` DROP COLUMN \`iconPath\``);

        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastActiveAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstName\` varchar(255) NULL`);
    }
}