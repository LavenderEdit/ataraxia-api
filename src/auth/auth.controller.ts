import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GuestLoginDto } from './dto/guest-login.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
    @ApiBody({ type: LoginDto })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @ApiOperation({ summary: 'Iniciar sesión como usuario invitado' })
    @Post('guest-login')
    async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
        return this.authService.guestLogin(guestLoginDto);
    }

    @ApiOperation({ summary: 'Registrar una cuenta nueva' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cerrar sesión (Invalida el token)' })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.authService.logout(userId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Generar un nuevo Access Token usando el Refresh Token' })
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(@Request() req) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña (Envía correo)' })
    @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @ApiOperation({ summary: 'Restablecer contraseña usando el token enviado al correo' })
    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener información del perfil autenticado' })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.authService.getProfile(userId);
    }
}