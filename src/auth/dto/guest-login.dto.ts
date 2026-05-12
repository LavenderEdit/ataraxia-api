import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GuestLoginDto {
    @ApiProperty({ example: 'device-uuid-1234', description: 'Identificador único del dispositivo del invitado' })
    @IsNotEmpty()
    @IsString()
    deviceId!: string;
}