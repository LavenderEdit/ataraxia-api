import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common'; // Asegúrate de importar UnauthorizedException
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { GuestLoginDto } from './dto/guest-login.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('guest-login')
    @HttpCode(HttpStatus.OK)
    async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
        return this.authService.guestLogin(guestLoginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.authService.login(user);
    }
}