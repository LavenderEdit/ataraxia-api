import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timer } from './entities/timer.entity';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';

@Injectable()
export class TimersService {
    constructor(
        @InjectRepository(Timer)
        private timersRepository: Repository<Timer>,
    ) { }

    async create(createTimerDto: CreateTimerDto, userId: string): Promise<Timer> {
        const timer = this.timersRepository.create({
            ...createTimerDto,
            user: { id: userId },
        });
        return this.timersRepository.save(timer);
    }

    async findAll(userId: string): Promise<Timer[]> {
        return this.timersRepository.find({
            where: { user: { id: userId } },
            order: { startTime: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Timer> {
        const timer = await this.timersRepository.findOne({
            where: { id, user: { id: userId } },
        });

        if (!timer) {
            throw new NotFoundException(`Timer #${id} no encontrado o no tienes acceso.`);
        }
        return timer;
    }

    async update(id: string, updateTimerDto: UpdateTimerDto, userId: string): Promise<Timer> {
        const timer = await this.findOne(id, userId);

        const updatedTimer = Object.assign(timer, updateTimerDto);

        return this.timersRepository.save(updatedTimer);
    }

    async remove(id: string, userId: string): Promise<void> {
        const result = await this.timersRepository.delete({
            id,
            user: { id: userId },
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Timer #${id} no encontrado o no tienes acceso.`);
        }
    }
}