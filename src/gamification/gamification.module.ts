import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [GamificationController],
    providers: [GamificationService],
    exports: [GamificationService],
})
export class GamificationModule { }