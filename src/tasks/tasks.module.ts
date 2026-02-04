import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { GamificationModule } from '../gamification/gamification.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        GamificationModule, // ✨ Importamos el módulo de gamificación
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }