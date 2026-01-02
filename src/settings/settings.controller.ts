import { Controller, Get, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    findOne(@Request() req) {
        return this.settingsService.findOne(req.user.sub);
    }

    @Patch()
    update(@Request() req, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.update(req.user.sub, updateSettingDto, req.user);
    }
}