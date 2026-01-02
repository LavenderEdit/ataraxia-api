import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { TimersService } from './timers.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timers')
export class TimersController {
    constructor(private readonly timersService: TimersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createTimerDto: CreateTimerDto, @Request() req) {
        return this.timersService.create(createTimerDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req) {
        return this.timersService.findAll(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.timersService.findOne(id, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTimerDto: UpdateTimerDto,
        @Request() req,
    ) {
        return this.timersService.update(id, updateTimerDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.timersService.remove(id, req.user);
    }
}