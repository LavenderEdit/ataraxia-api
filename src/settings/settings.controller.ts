import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post()
    create(@Body() createSettingDto: CreateSettingDto, @Request() req) {
        return this.settingsService.create(createSettingDto, req.user);
    }

    @Get()
    findOne(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException('No se pudo identificar al usuario en la petición (req.user es undefined)');
        }
        return this.settingsService.findOne(req.user);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.update(id, updateSettingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.settingsService.remove(id);
    }
}