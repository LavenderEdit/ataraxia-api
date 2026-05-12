import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsDateString, Matches, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimerDto {
    @ApiPropertyOptional({ example: 'Study', description: 'Etiqueta opcional para el timer' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'La etiqueta solo puede contener letras, números, espacios, guiones y guiones bajos' })
    tag?: string;

    @ApiProperty({ example: 1500, description: 'Duración en segundos' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: 'La duración debe ser al menos 1 segundo' })
    duration!: number;

    @ApiPropertyOptional({ example: '2023-10-27T10:00:00Z', description: 'Fecha de inicio (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    startTime?: Date;

    @ApiPropertyOptional({ example: '2023-10-27T10:25:00Z', description: 'Fecha de fin (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    endTime?: Date;

    @ApiPropertyOptional({ example: 'completed', description: 'Estado del timer', enum: ['completed', 'interrupted'] })
    @IsOptional()
    @IsString()
    @IsEnum(['completed', 'interrupted'], { message: 'El estado debe ser completed o interrupted' })
    status?: string;

    @ApiPropertyOptional({ example: 'uuid-de-la-tarea', description: 'ID de la tarea asociada' })
    @IsOptional()
    @IsString()
    taskId?: string;
}