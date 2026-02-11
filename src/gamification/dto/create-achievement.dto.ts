import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { AchievementType } from '../entities/achievement.entity';

export class CreateAchievementDto {
    @IsString()
    @IsNotEmpty()
    code: string; // Ej: 'NIGHT_OWL_1'

    @IsString()
    @IsNotEmpty()
    name: string; // Ej: 'Búho Nocturno'

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(AchievementType)
    @IsOptional()
    type?: AchievementType; // Por defecto será STREAK si no se envía

    @IsInt()
    @Min(1)
    threshold: number; // Ej: 5 (días o tareas)

    @IsInt()
    @IsOptional()
    points?: number;
}