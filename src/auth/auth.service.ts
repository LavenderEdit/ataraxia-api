import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { GuestLoginDto } from './dto/guest-login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // Método auxiliar para generar ambos tokens
    async getTokens(userId: string, email: string, isGuest: boolean) {
        const payload = { sub: userId, username: email, isGuest };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '15m', // Access Token corto (15 min)
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback_refresh_secret',
                expiresIn: '7d', // Refresh Token largo (7 días)
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    // Guardar el hash del refresh token en la DB
    async updateRefreshTokenHash(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.usersService.update(userId, {
            currentHashedRefreshToken: hash
        });
    }

    async login(user: any) {
        const tokens = await this.getTokens(user.id, user.email, user.isGuest);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: {
                id: user.id,
                name: user.firstName || user.email,
                email: user.email,
                isGuest: user.isGuest
            }
        };
    }

    async guestLogin(guestLoginDto: GuestLoginDto) {
        let user = await this.usersService.findGuestByDeviceId(guestLoginDto.deviceId);

        if (!user) {
            user = await this.usersService.createGuest(guestLoginDto.deviceId);
        }

        const tokens = await this.getTokens(user.id, user.email, true);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: { id: user.id, isGuest: true }
        };
    }

    async logout(userId: string) {
        await this.usersService.update(userId, { currentHashedRefreshToken: null });
        return { message: 'Logged out successfully' };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.currentHashedRefreshToken)
            throw new ForbiddenException('Access Denied');

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken,
        );

        if (!refreshTokenMatches)
            throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email, user.isGuest);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

        return tokens;
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
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
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