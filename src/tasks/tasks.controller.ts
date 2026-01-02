import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(req.user.sub, createTaskDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user.sub);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(req.user.sub, id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.tasksService.remove(req.user.sub, id);
    }
}