import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'JuanPerez23', description: 'Nombre de usuario único' })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    @IsString()
    // Opcional: Puedes agregar un patrón si quieres restringir caracteres en el username (ej: sin espacios)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El username solo puede contener letras, números y guiones bajos' })
    username!: string;

    @ApiProperty({ example: 'juan@ataraxia.app' })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email!: string;

    @ApiProperty({
        example: 'Pass1234',
        description: 'Mínimo 6 caracteres, 1 mayúscula, 1 minúscula y 1 número'
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'La contraseña es débil: requiere mayúscula, minúscula y número' }
    )
    password!: string;

    @ApiPropertyOptional({ example: 'uuid-dispositivo-123' })
    @IsOptional()
    @IsString()
    deviceId?: string;
}