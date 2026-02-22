import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum LeaderboardSortBy {
    EXPERIENCE = 'experience',
    POMODOROS = 'pomodorosCompleted',
}

export class GetLeaderboardDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(LeaderboardSortBy)
    sortBy?: LeaderboardSortBy = LeaderboardSortBy.EXPERIENCE;
}