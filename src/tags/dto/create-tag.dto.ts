import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    color?: string;
}