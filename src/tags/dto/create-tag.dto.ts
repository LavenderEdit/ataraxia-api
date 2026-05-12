import { IsNotEmpty, IsString, IsOptional, IsHexColor, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({ example: 'Trabajo', description: 'Nombre de la etiqueta' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'El nombre de la etiqueta solo puede contener letras, números, espacios, guiones y guiones bajos' })
    name!: string;

    @ApiPropertyOptional({ example: '#FF5733', description: 'Color en formato hexadecimal (ej. #FFFFFF)' })
    @IsOptional()
    @IsString()
    @IsHexColor({ message: 'El color debe ser un código hexadecimal válido (ej. #FFFFFF)' })
    color?: string;
}