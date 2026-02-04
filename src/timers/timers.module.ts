import { Module } from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from './entities/timer.entity';
import { GamificationModule } from '../gamification/gamification.module'; // ✨ Importar

@Module({
    imports: [
        TypeOrmModule.forFeature([Timer]),
        GamificationModule,
    ],
    controllers: [TimersController],
    providers: [TimersService],
    exports: [TimersService],
})
export class TimersModule { }