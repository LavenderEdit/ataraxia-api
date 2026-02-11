import { Controller, Get, Post, UseGuards, Request, ForbiddenException, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AchievementsService } from './achievements.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
    constructor(
        private readonly gamificationService: GamificationService,
        private readonly achievementsService: AchievementsService
    ) { }

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

    @Post('achievements/:code/icon')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new BadRequestException('Solo se permiten imágenes (jpg, png, gif)'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // Límite de 5MB
        }
    }))
    async uploadAchievementIcon(
        @Param('code') code: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {
        if (!file) throw new BadRequestException('Archivo no proporcionado');

        const updatedAchievement = await this.achievementsService.updateAchievementIcon(code, file);
        return {
            message: 'Icono actualizado correctamente en Google Drive',
            achievement: updatedAchievement,
            driveFileId: updatedAchievement.driveFileId
        };
    }
}