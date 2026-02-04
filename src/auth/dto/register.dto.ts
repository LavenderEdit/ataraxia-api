import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Juan', description: 'Nombre de pila del usuario' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    // Patrón: Solo letras (incluyendo tildes/ñ) y espacios. No números ni símbolos.
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    firstName: string;

    @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido del usuario' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El apellido solo puede contener letras y espacios' })
    lastName?: string;

    @ApiProperty({ example: 'juan@ataraxia.app' })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @ApiProperty({
        example: 'Pass1234',
        description: 'Mínimo 6 caracteres, 1 mayúscula, 1 minúscula y 1 número'
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    // Patrón: Al menos 1 mayúscula, 1 minúscula y 1 número (o caracter especial)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'La contraseña es débil: requiere mayúscula, minúscula y número' }
    )
    password: string;

    @ApiPropertyOptional({ example: 'uuid-dispositivo-123' })
    @IsOptional()
    @IsString()
    deviceId?: string;
}