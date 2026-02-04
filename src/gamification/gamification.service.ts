import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GamificationService {
    constructor(private readonly usersService: UsersService) { }

    async registerActivity(userId: string): Promise<User | null> {
        const user = await this.usersService.findById(userId);
        if (!user) return null;

        const now = new Date();
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

        if (lastActiveDate && lastActiveDate.getTime() === yesterday.getTime()) {
            newCurrentStreak = (user.currentStreak || 0) + 1;
        } else if (lastActiveDate && lastActiveDate.getTime() === today.getTime()) {
            newCurrentStreak = user.currentStreak || 1;
        }

        const newLongestStreak = Math.max(newCurrentStreak, user.longestStreak || 0);

        await this.usersService.update(user.id, {
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastActiveAt: now,
        });

        return this.usersService.findById(user.id);
    }

    async getUserStats(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) return null;

        return {
            currentStreak: user.currentStreak || 0,
            longestStreak: user.longestStreak || 0,
            lastActiveAt: user.lastActiveAt,
            level: Math.floor((user.currentStreak || 0) / 5) + 1,
        };
    }
}