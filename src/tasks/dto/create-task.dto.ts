import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ example: 'Estudiar NestJS', description: 'Título de la tarea' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-_.,!?áéíóúÁÉÍÓÚñÑ]+$/, { message: 'El título contiene caracteres no permitidos' })
    title!: string;

    @ApiPropertyOptional({ example: 'Programación', description: 'Etiqueta asociada (opcional)' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'La etiqueta solo puede contener letras, números, espacios, guiones y guiones bajos' })
    tag?: string;
}