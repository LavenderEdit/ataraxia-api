import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}