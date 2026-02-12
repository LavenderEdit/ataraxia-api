import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { UsersModule } from '../users/users.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { AchievementsService } from './achievements.service';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
        UsersModule,
        GoogleDriveModule,
        TypeOrmModule.forFeature([Achievement, UserAchievement, User]),
    ],
    controllers: [GamificationController],
    providers: [GamificationService, AchievementsService],
    exports: [GamificationService, AchievementsService],
})
export class GamificationModule { }