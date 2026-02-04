import { IsBoolean, IsNumber, IsString, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
    @ApiPropertyOptional({ example: 25, description: 'Duración del foco en minutos' })
    @IsNumber()
    @IsOptional()
    @Min(1, { message: 'La duración del foco debe ser al menos 1 minuto' })
    @Max(120, { message: 'La duración del foco no puede exceder 120 minutos' })
    focusDuration?: number;

    @ApiPropertyOptional({ example: 5, description: 'Duración del descanso corto en minutos' })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(30)
    shortBreakDuration?: number;

    @ApiPropertyOptional({ example: 15, description: 'Duración del descanso largo en minutos' })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(60)
    longBreakDuration?: number;

    @ApiPropertyOptional({ example: false, description: 'Iniciar descansos automáticamente' })
    @IsBoolean()
    @IsOptional()
    autoStartBreaks?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Iniciar pomodoros automáticamente' })
    @IsBoolean()
    @IsOptional()
    autoStartPomodoros?: boolean;

    @ApiPropertyOptional({ example: 4, description: 'Intervalo de pomodoros para descanso largo' })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10)
    longBreakInterval?: number;

    @ApiPropertyOptional({ example: 'light', description: 'Tema de la aplicación', enum: ['light', 'dark', 'system'] })
    @IsString()
    @IsOptional()
    @IsEnum(['light', 'dark', 'system'], { message: 'El tema debe ser light, dark o system' })
    theme?: string;

    @ApiPropertyOptional({ example: true, description: 'Habilitar sonidos' })
    @IsBoolean()
    @IsOptional()
    soundEnabled?: boolean;

    @ApiPropertyOptional({ example: 'web', description: 'Plataforma de la configuración', enum: ['web', 'mobile', 'desktop'] })
    @IsString()
    @IsOptional()
    @IsEnum(['web', 'mobile', 'desktop'], { message: 'La plataforma debe ser web, mobile o desktop' })
    platform?: string; // Ej: 'web', 'mobile'
}