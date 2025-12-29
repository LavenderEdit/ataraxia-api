import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(payload: any): Promise<User | null> {
        return this.usersService.findOne(payload.sub);
    }

    async loginGuest(deviceId: string) {
        let user = await this.usersService.findByDeviceId(deviceId);

        if (!user) {
            user = await this.usersService.createGuest(deviceId);
        }

        const payload = { sub: user.id, isGuest: user.isGuest };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(user: User, registerDto: RegisterDto) {
        if (!user.isGuest) {
            throw new BadRequestException('El usuario ya está registrado');
        }

        const existingEmail = await this.usersService.findByEmail(registerDto.email);
        if (existingEmail && existingEmail.id !== user.id) {
            throw new ConflictException('El correo electrónico ya está en uso');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);

        user.email = registerDto.email;
        user.name = registerDto.name;
        user.password = hashedPassword;
        user.isGuest = false;

        return this.usersService.save(user);
    }
}