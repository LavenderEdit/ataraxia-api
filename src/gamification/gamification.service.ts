import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AchievementsService } from './achievements.service';

@Injectable()
export class GamificationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly achievementsService: AchievementsService,
    ) { }

    async registerActivity(userId: string): Promise<User | null> {
        const user = await this.usersService.findById(userId);
        if (!user) return null;

        const now = new Date();

        if (user.isGuest) {
            await this.usersService.update(user.id, { lastActiveAt: now });
            return this.usersService.findById(user.id);
        }

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let lastActiveDate: Date | null = null;

        if (user.lastActiveAt) {
            const last = new Date(user.lastActiveAt);
            lastActiveDate = new Date(last.getFullYear(), last.getMonth(), last.getDate());
        }

        if (lastActiveDate && lastActiveDate.getTime() === today.getTime()) {
            await this.usersService.update(user.id, { lastActiveAt: now });
            return this.usersService.findById(user.id);
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newCurrentStreak = 1;

        if (lastActiveDate) {
            // Si la última vez fue ayer, suma racha
            if (lastActiveDate.getTime() === yesterday.getTime()) {
                newCurrentStreak = (user.currentStreak || 0) + 1;
            }
            // Nota: Si fue hoy ya lo manejamos arriba con el return.
            // Si fue antes de ayer, no entra aquí y se queda en 1 (reset).
        }

        const newLongestStreak = Math.max(newCurrentStreak, user.longestStreak || 0);

        await this.usersService.update(user.id, {
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastActiveAt: now,
        });

        const updatedUser = await this.usersService.findById(user.id);

        if (updatedUser) {
            await this.achievementsService.checkStreakAchievements(updatedUser, newCurrentStreak);
        }

        return updatedUser;
    }

    async getUserStats(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) return null;

        const achievements = await this.achievementsService.getUserAchievements(userId);

        return {
            currentStreak: user.currentStreak || 0,
            longestStreak: user.longestStreak || 0,
            lastActiveAt: user.lastActiveAt,
            level: Math.floor((user.currentStreak || 0) / 5) + 1,
            achievements,
        };
    }

    async findAllUserAchievements(userId: string) {
        return this.achievementsService.getUserAchievements(userId);
    }
}