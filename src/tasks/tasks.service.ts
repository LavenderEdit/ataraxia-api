import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private gamificationService: GamificationService, // ✨ Inyectamos
    ) { }

    async create(createTaskDto: CreateTaskDto, user: User) {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user: user,
            userId: user.id,
        });

        const savedTask = await this.tasksRepository.save(task);

        return { ...savedTask, userId: user.id };
    }

    async findAll(user: User) {
        return this.tasksRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, user: User) {
        const task = await this.tasksRepository.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!task) {
            throw new NotFoundException(`Task #${id} not found`);
        }
        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
        const task = await this.findOne(id, user);

        if (updateTaskDto.completed === true && !task.completed) {
            await this.gamificationService.registerActivity(user.id);
        }

        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: string, user: User) {
        const task = await this.findOne(id, user);
        return this.tasksRepository.softRemove(task);
    }
}