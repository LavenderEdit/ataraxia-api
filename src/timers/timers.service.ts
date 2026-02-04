import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timer } from './entities/timer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GamificationService } from '../gamification/gamification.service';
import { AchievementsService } from 'src/gamification/achievements.service';

@Injectable()
export class TimersService {
    constructor(
        @InjectRepository(Timer)
        private timersRepository: Repository<Timer>,
        private gamificationService: GamificationService,
        private achievementsService: AchievementsService,
    ) { }

    async create(createTimerDto: CreateTimerDto, user: User) {
        const timer = this.timersRepository.create({
            ...createTimerDto,
            user,
            userId: user.id
        });

        const savedTimer = await this.timersRepository.save(timer);

        if (savedTimer.status === 'completed') {
            await this.gamificationService.registerActivity(user.id);

            const totalCompleted = await this.timersRepository.count({
                where: {
                    userId: user.id,
                    status: 'completed'
                }
            });

            await this.achievementsService.checkPomodoroAchievements(user, totalCompleted);
        }

        return savedTimer;
    }

    async findAll(user: User) {
        return this.timersRepository.find({
            where: { userId: user.id },
            order: { startTime: 'DESC' },
            relations: ['task'],
        });
    }

    async findOne(id: string, user: User) {
        const timer = await this.timersRepository.findOne({
            where: { id, userId: user.id },
            relations: ['task'],
        });
        if (!timer) throw new NotFoundException('Timer not found');
        return timer;
    }

    async update(id: string, updateTimerDto: UpdateTimerDto, user: User) {
        const timer = await this.findOne(id, user); // findOne ya trae la relación, útil si necesitas verificar algo de la tarea
        const wasCompleted = timer.status === 'completed';

        Object.assign(timer, updateTimerDto);
        const updatedTimer = await this.timersRepository.save(timer);

        if (!wasCompleted && updatedTimer.status === 'completed') {
            await this.gamificationService.registerActivity(user.id);

            const totalCompleted = await this.timersRepository.count({
                where: { userId: user.id, status: 'completed' }
            });
            await this.achievementsService.checkPomodoroAchievements(user, totalCompleted);
        }

        return updatedTimer;
    }

    async remove(id: string, user: User) {
        const timer = await this.findOne(id, user);
        return this.timersRepository.remove(timer);
    }
}