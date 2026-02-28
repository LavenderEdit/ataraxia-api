import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private gamificationService: GamificationService,
    ) { }

    async create(createTaskDto: CreateTaskDto, userId: string) {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            userId: userId,
        });

        return await this.tasksRepository.save(task);
    }

    async findAll(userId: string) {
        return this.tasksRepository.find({
            where: { userId: userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id, userId: userId },
        });

        if (!task) {
            throw new NotFoundException(`Task #${id} not found`);
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const task = await this.findOne(id, userId);

        if (updateTaskDto.completed === true && !task.completed) {
            await this.gamificationService.registerActivity(userId);
        }

        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: string, userId: string) {
        const task = await this.findOne(id, userId);
        return this.tasksRepository.softRemove(task);
    }
}