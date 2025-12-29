import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('guest')
    async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
        return this.authService.loginGuest(guestLoginDto.deviceId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Request() req) {
        return this.authService.register(req.user, registerDto);
    }
}