import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async createDefault(user: User) {
        const defaultSettings = this.settingsRepository.create({
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            notificationsEnabled: true,
            soundEnabled: true,
            user: user,
        });
        return this.settingsRepository.save(defaultSettings);
    }

    async create(createSettingDto: CreateSettingDto, user: User) {
        const existing = await this.findOne(user);
        if (existing) {
            return this.update(existing.id, createSettingDto, user);
        }

        const setting = this.settingsRepository.create({
            ...createSettingDto,
            user,
        });
        return this.settingsRepository.save(setting);
    }

    async findAll(user: User) {
        return this.settingsRepository.find({ where: { user: { id: user.id } } });
    }

    async findOne(user: User) {
        return this.settingsRepository.findOne({ where: { user: { id: user.id } } });
    }

    async update(id: string, updateSettingDto: UpdateSettingDto, user: User) {
        const setting = await this.findOne(user);
        if (!setting) {
            return this.create(updateSettingDto as CreateSettingDto, user);
        }

        this.settingsRepository.merge(setting, updateSettingDto);
        return this.settingsRepository.save(setting);
    }

    remove(id: number) {
        return `This action removes a #${id} setting`;
    }
}