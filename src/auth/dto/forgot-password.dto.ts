import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'usuario@correo.com',
        description: 'Correo electrónico asociado a la cuenta'
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}