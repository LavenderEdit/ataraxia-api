import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GuestLoginDto } from './dto/guest-login.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Post('guest-login')
    async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
        return this.authService.guestLogin(guestLoginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Request() req) {
        return this.authService.logout(req.user.id);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(@Request() req) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}