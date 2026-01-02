import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TimersService } from './timers.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timers')
@UseGuards(JwtAuthGuard)
export class TimersController {
    constructor(private readonly timersService: TimersService) { }

    @Post()
    create(@Request() req, @Body() createTimerDto: CreateTimerDto) {
        return this.timersService.create(createTimerDto, req.user.sub);
    }

    @Get()
    findAll(@Request() req) {
        return this.timersService.findAll(req.user.sub);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.timersService.findOne(id, req.user.sub);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateTimerDto: UpdateTimerDto) {
        return this.timersService.update(id, updateTimerDto, req.user.sub);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.timersService.remove(id, req.user.sub);
    }
}