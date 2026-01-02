import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async findOne(userId: string): Promise<Setting> {
        const settings = await this.settingsRepository.findOne({
            where: { user: { id: userId } },
        });
        if (!settings) throw new NotFoundException('Configuración no encontrada');
        return settings;
    }

    async update(userId: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
        const settings = await this.findOne(userId);
        Object.assign(settings, updateSettingDto);
        return this.settingsRepository.save(settings);
    }
}