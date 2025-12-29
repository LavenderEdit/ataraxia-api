export class CreateTimerDto {
    tag?: string;
    duration: number;
    startTime?: Date;
    endTime?: Date;
    status?: string;
}