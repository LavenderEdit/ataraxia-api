import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    tag?: string;
}