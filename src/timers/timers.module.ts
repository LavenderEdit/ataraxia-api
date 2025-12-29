import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';
import { Timer } from './entities/timer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Timer])],
    controllers: [TimersController],
    providers: [TimersService],
})
export class TimersModule { }