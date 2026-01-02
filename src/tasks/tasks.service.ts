import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user: { id: userId },
        });
        return this.tasksRepository.save(task);
    }

    async findAll(userId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id: taskId, user: { id: userId } },
        });

        if (!task) {
            throw new NotFoundException('Tarea no encontrada o no tienes permisos');
        }

        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(userId: string, taskId: string): Promise<void> {
        const result = await this.tasksRepository.delete({
            id: taskId,
            user: { id: userId },
        });

        if (result.affected === 0) {
            throw new NotFoundException('Tarea no encontrada');
        }
    }
}