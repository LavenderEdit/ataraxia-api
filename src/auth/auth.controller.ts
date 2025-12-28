import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('guest')
    async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
        return this.authService.loginGuest(guestLoginDto);
    }
}