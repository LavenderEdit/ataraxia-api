import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GuestLoginDto {
    @IsNotEmpty()
    @IsString()
    deviceId: string;
}