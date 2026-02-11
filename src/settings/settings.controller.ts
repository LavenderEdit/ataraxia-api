import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Configuraciones')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @ApiOperation({ summary: 'Crear configuración personalizada' })
    @Post()
    create(@Body() createSettingDto: CreateSettingDto, @Request() req) {
        return this.settingsService.create(createSettingDto, req.user);
    }

    @ApiOperation({ summary: 'Obtener configuración específica por ID' })
    @Get()
    findOne(@Request() req, @Query('platform') platform?: string) {
        return this.settingsService.findOne(req.user, platform);
    }

    @ApiOperation({ summary: 'Actualizar valor de configuración por el mismo usuario.' })
    @Patch()
    updateByUser(@Request() req, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.updateByUser(req.user, updateSettingDto);
    }

    @ApiOperation({ summary: 'Obtener todas las configuraciones' })
    @Get('all')
    findAll() {
        return this.settingsService.findAll();
    }

    @ApiOperation({ summary: 'Actualizar valor de configuración por un administrador.' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.update(id, updateSettingDto);
    }

    @ApiOperation({ summary: 'Eliminar configuración' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.settingsService.remove(id);
    }
}