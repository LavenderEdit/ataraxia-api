import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    newPassword: string;
}