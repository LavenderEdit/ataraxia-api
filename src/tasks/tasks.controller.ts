import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tareas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @ApiOperation({ summary: 'Crear una nueva tarea' })
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
        const userId = req.user.id;
        return this.tasksService.create(createTaskDto, userId);
    }

    @ApiOperation({ summary: 'Listar todas las tareas del usuario' })
    @Get()
    findAll(@Req() req: any) {
        const userId = req.user.id;
        return this.tasksService.findAll(userId);
    }

    @ApiOperation({ summary: 'Obtener una tarea por ID' })
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.id;
        return this.tasksService.findOne(id, userId);
    }

    @ApiOperation({ summary: 'Actualizar una tarea' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: any) {
        const userId = req.user.id;
        return this.tasksService.update(id, updateTaskDto, userId);
    }

    @ApiOperation({ summary: 'Eliminar una tarea' })
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.id;
        return this.tasksService.remove(id, userId);
    }
}