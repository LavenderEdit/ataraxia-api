import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timer } from './entities/timer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TimersService {
    constructor(
        @InjectRepository(Timer)
        private timersRepository: Repository<Timer>,
    ) { }

    async create(createTimerDto: CreateTimerDto, user: User) {
        const timer = this.timersRepository.create({
            ...createTimerDto,
            user: user,
        });

        return await this.timersRepository.save(timer);
    }

    async findAll(user: User) {
        return this.timersRepository.find({
            where: { user: { id: user.id } },
            order: { startTime: 'DESC' },
            relations: ['task'],
        });
    }

    async findOne(id: string, user: User) {
        const timer = await this.timersRepository.findOne({
            where: { id, user: { id: user.id } },
            relations: ['task'],
        });

        if (!timer) {
            throw new NotFoundException(`Timer #${id} not found`);
        }
        return timer;
    }

    async update(id: string, updateTimerDto: UpdateTimerDto, user: User) {
        const existingTimer = await this.findOne(id, user);

        const timerUpdate = this.timersRepository.merge(existingTimer, updateTimerDto);

        if (Object.keys(updateTimerDto).length === 0) {
            return existingTimer;
        }

        return this.timersRepository.save(timerUpdate);
    }

    async remove(id: string, user: User) {
        const timer = await this.findOne(id, user);
        return this.timersRepository.remove(timer);
    }
}