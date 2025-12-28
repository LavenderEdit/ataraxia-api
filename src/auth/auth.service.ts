import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    // Lógica de "Lazy Registration" (Capítulo 5.1 PDF)
    async loginGuest(guestLoginDto: GuestLoginDto) {
        const { deviceId } = guestLoginDto;

        // 1. Buscar si ya existe un invitado con este deviceId
        let user = await this.usersRepository.findOne({ where: { deviceId } });

        // 2. Si no existe, lo creamos (Registro implícito)
        if (!user) {
            user = this.usersRepository.create({
                deviceId,
                isGuest: true,
            });
            await this.usersRepository.save(user);
        }

        // 3. Generar el JWT
        const payload = { sub: user.id, isGuest: user.isGuest };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                isGuest: user.isGuest,
                deviceId: user.deviceId,
            },
        };
    }
}