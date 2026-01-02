import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, isGuest: user.isGuest };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isGuest: user.isGuest
            }
        };
    }

    async guestLogin(guestLoginDto: GuestLoginDto) {
        let user = await this.usersService.findGuestByDeviceId(guestLoginDto.deviceId);

        if (!user) {
            user = await this.usersService.createGuest(
                guestLoginDto.deviceId
            );
        }

        const payload = { sub: user.id, deviceId: user.deviceId, isGuest: true };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, isGuest: true }
        };
    }

    async register(registerDto: RegisterDto) {
        const existingEmail = await this.usersService.findByEmail(registerDto.email);
        if (existingEmail) {
            throw new ConflictException('El correo electrónico ya está registrado.');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        if (registerDto.deviceId) {
            const existingGuest = await this.usersService.findGuestByDeviceId(registerDto.deviceId);

            if (existingGuest) {
                const upgradedUser = await this.usersService.upgradeGuestToUser(existingGuest.id, {
                    email: registerDto.email,
                    password: hashedPassword,
                });

                return this.login(upgradedUser);
            }
        }

        const newUser = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        return this.login(newUser);
    }
}