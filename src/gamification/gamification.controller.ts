import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Get('stats')
    async getStats(@Request() req) {
        return this.gamificationService.getUserStats(req.user.id);
    }

    @Post('test-activity')
    async registerActivity(@Request() req) {
        return this.gamificationService.registerActivity(req.user.id);
    }

    @Get('achievements')
    findAll(@Request() req) {
        if (req.user.isGuest) {
            throw new ForbiddenException('Los invitados no tienen acceso a los logros. Por favor regístrate.');
        }
        return this.gamificationService.findAllUserAchievements(req.user.userId);
    }

    @Post('check-achievements')
    checkAchievements(@Request() req) {
        if (req.user.isGuest) {
            throw new ForbiddenException('Los invitados no tienen acceso al progreso de logros.');
        }
        return { message: 'Verificación realizada' };
    }
}