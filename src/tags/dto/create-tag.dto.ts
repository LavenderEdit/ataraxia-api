import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsHexColor({ message: 'El color debe ser un código hexadecimal válido (ej. #FFFFFF)' })
    color?: string;
}