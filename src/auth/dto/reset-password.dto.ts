import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'abc123xyz890token...',
        description: 'Token de seguridad enviado al correo del usuario'
    })
    @IsNotEmpty()
    @IsString()
    token!: string;

    @ApiProperty({
        example: 'NuevaClaveSegura123',
        description: 'Nueva contraseña del usuario (mínimo 6 caracteres)'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    newPassword!: string;
}