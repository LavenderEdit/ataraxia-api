import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private settingsService: SettingsService,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async update(id: string, updateUserDto: any) {
        return this.usersRepository.update(id, updateUserDto);
    }

    async findByDeviceId(deviceId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { deviceId } });
    }

    async findGuestByDeviceId(deviceId: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { deviceId, isGuest: true }
        });
    }

    async createGuest(deviceId: string) {
        const user = this.usersRepository.create({
            deviceId,
            isGuest: true,
            email: `guest_${deviceId}@ataraxia.temp`,
        });

        const savedUser = await this.usersRepository.save(user);

        await this.settingsService.createDefault(savedUser);

        return savedUser;
    }

    async create(createUserDto: RegisterDto) {
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);

        await this.settingsService.createDefault(savedUser);

        return savedUser;
    }

    async upgradeGuestToUser(id: string, userData: Partial<User>): Promise<User | null> {
        await this.usersRepository.update(id, {
            ...userData,
            isGuest: false,
        });
        return this.usersRepository.findOne({ where: { id } });
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}