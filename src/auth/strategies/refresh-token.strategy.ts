import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'fallback_refresh_secret',
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            throw new ForbiddenException('Refresh token malformed');
        }

        const refreshToken = authHeader.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}