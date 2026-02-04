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
        // Aseguramos que tenga una plataforma por defecto si no viene en el DTO
        const platform = createSettingDto.platform || 'web';

        const setting = this.settingsRepository.create({
            ...createSettingDto,
            platform,
            user,
        });
        return this.settingsRepository.save(setting);
    }

    async createDefault(user: User, platform: string = 'web') {
        const defaultSettings = this.settingsRepository.create({
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: false,
            autoStartPomodoros: false,
            longBreakInterval: 4,
            soundEnabled: true,
            theme: 'light',
            platform: platform,
            user: user,
        });
        return this.settingsRepository.save(defaultSettings);
    }

    async findAll() {
        return this.settingsRepository.find();
    }

    // Busca por usuario Y plataforma. Si no existe, la crea (Self-healing).
    // Esto evita errores 404 cuando el usuario cambia de dispositivo.
    async findOne(user: User, platform: string = 'web') {
        if (!user || !user.id) {
            throw new BadRequestException('Usuario no válido o ID no encontrado al buscar configuraciones');
        }

        const setting = await this.settingsRepository.findOne({
            where: {
                user: { id: user.id },
                platform: platform
            }
        });

        if (!setting) {
            return this.createDefault(user, platform);
        }

        return setting;
    }

    async update(id: string, updateSettingDto: UpdateSettingDto) {
        if (Object.keys(updateSettingDto).length === 0) {
            return this.settingsRepository.findOne({ where: { id: +id } });
        }

        await this.settingsRepository.update(id, updateSettingDto);
        return this.settingsRepository.findOne({ where: { id: +id } });
    }

    async remove(id: string) {
        return this.settingsRepository.delete(id);
    }

    async updateByUser(user: User, updateSettingDto: UpdateSettingDto) {
        const platform = updateSettingDto.platform || 'web';

        // 1. Buscamos (o creamos si no existe) la configuración para esa plataforma
        const setting = await this.findOne(user, platform);

        // 2. Actualizamos esa configuración específica
        // Usamos assign para mezclar los datos nuevos sobre la entidad existente
        Object.assign(setting, updateSettingDto);

        return this.settingsRepository.save(setting);
    }
}