import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto'; // Usualmente se comparte o se define
import { User } from './entities/user.entity';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private settingsService: SettingsService,
    ) { }

    async create(createUserDto: RegisterDto) {
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);

        await this.settingsService.createDefault(savedUser);

        return savedUser;
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

    async findOne(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneByDeviceId(deviceId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { deviceId } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async update(id: string, updateUserDto: any) {
        return this.usersRepository.update(id, updateUserDto);
    }
}