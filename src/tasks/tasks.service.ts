import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
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

        const updatedTask = await this.tasksRepository.preload({
            id: id,
            ...updateTaskDto,
            user: user,
        });

        if (!updatedTask) {
            throw new NotFoundException(`Task #${id} not found`);
        }

        return this.tasksRepository.save(updatedTask);
    }

    async remove(id: string, user: User) {
        const task = await this.findOne(id, user);
        return this.tasksRepository.remove(task);
    }
}