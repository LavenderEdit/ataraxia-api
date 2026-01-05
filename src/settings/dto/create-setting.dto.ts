import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSettingDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    focusDuration?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    shortBreakDuration?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    longBreakDuration?: number;

    @IsOptional()
    @IsBoolean()
    autoStartBreaks?: boolean;

    @IsOptional()
    @IsBoolean()
    autoStartPomodoros?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(1)
    longBreakInterval?: number;
}