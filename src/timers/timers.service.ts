import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timer } from './entities/timer.entity';
import { User } from '../users/entities/user.entity';
import { CreateTimerDto } from './dto/create-timer.dto';

@Injectable()
export class TimersService {
    constructor(
        @InjectRepository(Timer)
        private timersRepository: Repository<Timer>,
    ) { }

    async create(createTimerDto: CreateTimerDto, user: User) {
        const newTimer = this.timersRepository.create({
            ...createTimerDto,
            user: user,
        });
        return this.timersRepository.save(newTimer);
    }

    async findAllByUser(user: User) {
        return this.timersRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }
}