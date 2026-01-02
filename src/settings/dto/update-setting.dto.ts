import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
    @IsOptional()
    @IsNumber()
    focusDuration?: number;

    @IsOptional()
    @IsNumber()
    shortBreakDuration?: number;

    @IsOptional()
    @IsNumber()
    longBreakDuration?: number;

    @IsOptional()
    @IsString()
    theme?: string;

    @IsOptional()
    @IsBoolean()
    soundEnabled?: boolean;
}