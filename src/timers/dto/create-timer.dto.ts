import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTimerDto {
    @IsOptional()
    @IsString()
    tag?: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsOptional()
    @IsDateString()
    startTime?: Date;

    @IsOptional()
    @IsDateString()
    endTime?: Date;

    @IsOptional()
    @IsString()
    status?: string;
}