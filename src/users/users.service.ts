import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByDeviceId(deviceId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { deviceId } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async createGuest(deviceId: string): Promise<User> {
        const newUser = this.usersRepository.create({
            deviceId,
            isGuest: true,
        });
        return this.usersRepository.save(newUser);
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}