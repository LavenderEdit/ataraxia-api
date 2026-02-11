import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { User } from '../users/entities/user.entity';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AchievementsService {
    private readonly logger = new Logger(AchievementsService.name);

    constructor(
        @InjectRepository(Achievement)
        private achievementRepo: Repository<Achievement>,
        @InjectRepository(UserAchievement)
        private userAchievementRepo: Repository<UserAchievement>,
        private googleDriveService: GoogleDriveService,
        private configService: ConfigService,
    ) { }

    // --- LÓGICA DE UPLOAD A DRIVE v0.3.5 ---
    async updateAchievementIcon(code: string, file: Express.Multer.File) {
        const achievement = await this.achievementRepo.findOne({ where: { code } });
        if (!achievement) throw new NotFoundException(`Logro con código ${code} no encontrado`);

        // 1. Borrar versión anterior de Drive si existe
        if (achievement.driveFileId) {
            await this.googleDriveService.deleteFile(achievement.driveFileId);
        }

        // 2. Subir nuevo archivo a Drive
        // Generamos un nombre único: codigo_timestamp.ext
        const ext = file.originalname.split('.').pop();
        const filename = `${code}_${Date.now()}.${ext}`;

        const newFileId = await this.googleDriveService.uploadFile(
            filename,
            file.mimetype,
            file.buffer // Multer MemoryStorage nos da esto
        );

        // 3. Actualizar BD
        achievement.driveFileId = newFileId;
        achievement.iconPath = null; // Limpiamos referencia local si existía

        return this.achievementRepo.save(achievement);
    }
    // ---------------------------------------

    async checkStreakAchievements(user: User, currentStreak: number) {
        const potentialAchievements = await this.achievementRepo.find({
            where: { type: AchievementType.STREAK },
        });

        for (const achievement of potentialAchievements) {
            if (currentStreak >= achievement.threshold) {
                await this.unlockAchievement(user, achievement);
            }
        }
    }

    async checkPomodoroAchievements(user: User, totalPomodorosCompleted: number) {
        const potentialAchievements = await this.achievementRepo.find({
            where: { type: AchievementType.POMODORO_COUNT },
        });

        for (const achievement of potentialAchievements) {
            if (totalPomodorosCompleted >= achievement.threshold) {
                await this.unlockAchievement(user, achievement);
            }
        }
    }

    private async unlockAchievement(user: User, achievement: Achievement) {
        const exists = await this.userAchievementRepo.findOne({
            where: { user: { id: user.id }, achievement: { id: achievement.id } },
        });

        if (!exists) {
            this.logger.log(`User ${user.id} unlocked achievement: ${achievement.name}`);
            const newUnlock = this.userAchievementRepo.create({
                user,
                achievement,
            });
            await this.userAchievementRepo.save(newUnlock);
            // TODO: Posibilidad para emitir un evento o notificación
        }
    }

    // Obtener logros del usuario con la URL de la imagen de Drive
    async getUserAchievements(userId: string) {
        const unlocks = await this.userAchievementRepo.find({
            where: { user: { id: userId } },
            relations: ['achievement']
        });

        const results = await Promise.all(
            unlocks.map(async (unlock) => {
                let iconUrl = '';
                if (unlock.achievement.driveFileId) {
                    try {
                        iconUrl = await this.googleDriveService.getFileViewLink(
                            unlock.achievement.driveFileId,
                        );
                    } catch (error) {
                        this.logger.warn(`Could not fetch drive link for achievement ${unlock.achievement.id}`);
                    }
                }

                return {
                    ...unlock,
                    iconUrl,
                };
            }),
        );

        return results;
    }

    // Endpoint auxiliar para poblar logros iniciales (Seed)
    async seedAchievements() {
        // Ejemplo: Crear logro de racha de 3 días si no existe
        const count = await this.achievementRepo.count();
        if (count === 0) {
            await this.achievementRepo.save([
                { code: 'STREAK_3', name: 'Principiante', description: 'Racha de 3 días', type: AchievementType.STREAK, threshold: 3, driveFileId: 'ID_DEL_ICONO_EN_DRIVE_1' },
                { code: 'STREAK_7', name: 'Dedicado', description: 'Racha de 7 días', type: AchievementType.STREAK, threshold: 7, driveFileId: 'ID_DEL_ICONO_EN_DRIVE_2' },
                { code: 'POMO_10', name: 'Enfocado', description: '10 Pomodoros completados', type: AchievementType.POMODORO_COUNT, threshold: 10, driveFileId: 'ID_DEL_ICONO_EN_DRIVE_3' },
            ]);
        }
    }
}