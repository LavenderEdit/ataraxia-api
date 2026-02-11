import { Controller, Get, Patch, Post, UseGuards, Body, Request, ForbiddenException, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gamificación')
@ApiBearerAuth()
@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
    constructor(
        private readonly gamificationService: GamificationService,
        private readonly achievementsService: AchievementsService
    ) { }

    @ApiOperation({ summary: 'Obtener estadísticas del usuario (Racha, Nivel, Logros)' })
    @Get('stats')
    async getStats(@Request() req) {
        return this.gamificationService.getUserStats(req.user.id);
    }

    @ApiOperation({ summary: 'Registrar actividad diaria (Simulación)' })
    @Post('test-activity')
    async registerActivity(@Request() req) {
        return this.gamificationService.registerActivity(req.user.id);
    }

    @ApiOperation({ summary: 'Listar todos los logros desbloqueados por el usuario' })
    @Get('achievements')
    findAll(@Request() req) {
        if (req.user.isGuest) {
            throw new ForbiddenException('Los invitados no tienen acceso a los logros. Por favor regístrate.');
        }
        return this.gamificationService.findAllUserAchievements(req.user.userId);
    }

    @ApiOperation({ summary: 'Verificar estado de logros (Check manual)' })
    @Post('check-achievements')
    checkAchievements(@Request() req) {
        if (req.user.isGuest) {
            throw new ForbiddenException('Los invitados no tienen acceso al progreso de logros.');
        }
        return { message: 'Verificación realizada' };
    }

    // --- ADMIN: CREAR LOGRO ---
    @ApiOperation({ summary: '[ADMIN] Crear definición de un nuevo logro' })
    @ApiResponse({ status: 201, description: 'Logro creado exitosamente.' })
    @ApiResponse({ status: 409, description: 'El código del logro ya existe.' })
    @Post('achievements')
    async createAchievement(@Body() createDto: CreateAchievementDto, @Request() req) {
        // if (!req.user.isAdmin) throw new ForbiddenException('Solo admins');
        return this.achievementsService.create(createDto);
    }

    // --- ADMIN: ACTUALIZAR LOGRO (Metadata) ---
    // PATCH /api/gamification/achievements/:code
    @ApiOperation({ summary: '[ADMIN] Actualizar datos de un logro' })
    @Patch('achievements/:code')
    async updateAchievement(
        @Param('code') code: string,
        @Body() updateDto: UpdateAchievementDto,
        @Request() req
    ) {
        // if (!req.user.isAdmin) throw new ForbiddenException('Solo admins');
        return this.achievementsService.update(code, updateDto);
    }

    // --- ADMIN: SUBIR/ACTUALIZAR IMAGEN ---
    @ApiOperation({ summary: '[ADMIN] Subir o actualizar icono del logro (Sube a Google Drive)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagen del logro (.png, .jpg, .gif)',
                },
            },
        },
    })
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
            fileSize: 5 * 1024 * 1024
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