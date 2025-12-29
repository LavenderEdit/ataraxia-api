import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TimersService } from './timers.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('timers')
export class TimersController {
    constructor(private readonly timersService: TimersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createTimerDto: CreateTimerDto, @Request() req) {
        return this.timersService.create(createTimerDto, req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Request() req) {
        return this.timersService.findAllByUser(req.user);
    }
}