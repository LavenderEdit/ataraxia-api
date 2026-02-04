import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

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
    findOne(@Request() req, @Query('platform') platform?: string) {
        return this.settingsService.findOne(req.user, platform);
    }

    @Patch()
    updateByUser(@Request() req, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.updateByUser(req.user, updateSettingDto);
    }

    @Get('all')
    findAll() {
        return this.settingsService.findAll();
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