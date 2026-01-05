import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async create(createSettingDto: CreateSettingDto, user: User) {
        const setting = this.settingsRepository.create({
            ...createSettingDto,
            user,
        });
        return this.settingsRepository.save(setting);
    }

    async createDefault(user: User) {
        const defaultSettings = this.settingsRepository.create({
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: false,
            autoStartPomodoros: false,
            longBreakInterval: 4,
            user: user,
        });
        return this.settingsRepository.save(defaultSettings);
    }

    async findAll() {
        return this.settingsRepository.find();
    }

    async findOne(user: User) {
        if (!user || !user.id) {
            throw new BadRequestException('Usuario no válido o ID no encontrado al buscar configuraciones');
        }

        const setting = await this.settingsRepository.findOne({
            where: { user: { id: user.id } }
        });

        if (!setting) {
            throw new NotFoundException(`No se encontraron configuraciones para el usuario ${user.id}`);
        }

        return setting;
    }

    async update(id: string, updateSettingDto: UpdateSettingDto) {
        if (Object.keys(updateSettingDto).length === 0) {
            return this.settingsRepository.findOne({ where: { id } });
        }

        await this.settingsRepository.update(id, updateSettingDto);
        return this.settingsRepository.findOne({ where: { id } });
    }

    async remove(id: string) {
        return this.settingsRepository.delete(id);
    }
}