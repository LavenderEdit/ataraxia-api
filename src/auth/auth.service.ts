import { Injectable, UnauthorizedException, ConflictException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { GuestLoginDto } from './dto/guest-login.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer'; // Importamos el Mailer
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailerService: MailerService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmailWithPassword(email);

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
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
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
                name: user.username || user.email,
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
        const user = await this.usersService.findByIdWithRefreshToken(userId);

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
                // CAMBIO: Mapeamos username en el upgrade
                const upgradedUser = await this.usersService.upgradeGuestToUser(existingGuest.id, {
                    email: registerDto.email,
                    password: hashedPassword,
                    name: registerDto.username,
                });

                return this.login(upgradedUser);
            }
        }

        const newUser = await this.usersService.create({
            email: registerDto.email,
            password: hashedPassword,
            name: registerDto.username, // CAMBIO: Mapeo directo
            isGuest: false,
        });

        return this.login(newUser);
    }

    // --- NUEVAS FUNCIONALIDADES v0.3 (Fusionadas) ---

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);

        if (!user || user.isGuest) {
            return { message: 'Si el correo existe, recibirás un enlace para recuperar tu contraseña.' };
        }

        const token = uuidv4();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await this.usersService.update(user.id, {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        });

        const frontendUrls = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const primaryFrontendUrl = frontendUrls.split(',')[0].trim();

        const resetUrl = `${primaryFrontendUrl}/reset-password?token=${token}`;

        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Recuperación de Contraseña - Ataraxia',
                template: 'forgot-password',
                context: {
                    name: user.name || 'Usuario',
                    url: resetUrl,
                },
            });
        } catch (error) {
            console.error('Error enviando email:', error);
            throw new BadRequestException('Error técnico enviando el correo.');
        }

        return { message: 'Si el correo existe, recibirás un enlace para recuperar tu contraseña.' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;

        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            throw new BadRequestException('Token inválido o expirado');
        }

        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new BadRequestException('El token ha expirado');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.usersService.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return { message: 'Contraseña actualizada correctamente' };
    }

    async getProfile(userId: string) {
        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const {
            password,
            resetPasswordToken,
            resetPasswordExpires,
            currentHashedRefreshToken,
            ...profile
        } = user;

        return profile;
    }
}