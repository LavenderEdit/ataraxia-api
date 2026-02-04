import { IsBoolean, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateSettingDto {
    @IsNumber()
    @IsOptional()
    focusDuration?: number;

    @IsNumber()
    @IsOptional()
    shortBreakDuration?: number;

    @IsNumber()
    @IsOptional()
    longBreakDuration?: number;

    @IsBoolean()
    @IsOptional()
    autoStartBreaks?: boolean;

    @IsBoolean()
    @IsOptional()
    autoStartPomodoros?: boolean;

    @IsNumber()
    @IsOptional()
    longBreakInterval?: number;

    @IsString()
    @IsOptional()
    theme?: string;

    @IsBoolean()
    @IsOptional()
    soundEnabled?: boolean;

    @IsString()
    @IsOptional()
    platform?: string; // Ej: 'web', 'mobile'
}