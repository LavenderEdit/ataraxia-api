import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { AchievementType } from '../entities/achievement.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
    @ApiProperty({ example: 'STREAK_100', description: 'Código único del logro' })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiProperty({ example: 'Centurión', description: 'Nombre visible del logro' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'Completa 100 días de racha', description: 'Descripción del logro' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiPropertyOptional({ enum: AchievementType, default: AchievementType.STREAK })
    @IsEnum(AchievementType)
    @IsOptional()
    type?: AchievementType;

    @ApiProperty({ example: 100, description: 'Cantidad necesaria para desbloquear' })
    @IsInt()
    @Min(1)
    threshold!: number;

    @ApiPropertyOptional({ example: 500, description: 'Puntos de experiencia otorgados' })
    @IsInt()
    @IsOptional()
    points?: number;
}