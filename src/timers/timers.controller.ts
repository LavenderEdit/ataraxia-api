import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TimersService } from './timers.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Temporizadores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('timers')
export class TimersController {
    constructor(private readonly timersService: TimersService) { }

    @ApiOperation({ summary: 'Crear configuración de temporizador' })
    @Post()
    create(@Body() createTimerDto: CreateTimerDto, @Request() req) {
        return this.timersService.create(createTimerDto, req.user.userId);
    }

    @ApiOperation({ summary: 'Listar temporizadores del usuario' })
    @Get()
    findAll(@Request() req) {
        return this.timersService.findAll(req.user.userId);
    }

    @ApiOperation({ summary: 'Obtener temporizador por ID' })
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.timersService.findOne(id, req.user.userId);
    }

    @ApiOperation({ summary: 'Actualizar temporizador' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTimerDto: UpdateTimerDto, @Request() req) {
        return this.timersService.update(id, updateTimerDto, req.user.userId);
    }

    @ApiOperation({ summary: 'Eliminar temporizador' })
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.timersService.remove(id, req.user.userId);
    }
}