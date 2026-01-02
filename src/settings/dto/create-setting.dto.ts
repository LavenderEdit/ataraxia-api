import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

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
    notificationsEnabled?: boolean;

    @IsBoolean()
    @IsOptional()
    soundEnabled?: boolean;
}