import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,
    ) { }

    async create(userId: string, createTagDto: CreateTagDto): Promise<Tag> {
        const tag = this.tagsRepository.create({
            ...createTagDto,
            user: { id: userId },
        });
        return this.tagsRepository.save(tag);
    }

    async findAll(userId: string): Promise<Tag[]> {
        return this.tagsRepository.find({
            where: { user: { id: userId } },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Tag> {
        const tag = await this.tagsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!tag) throw new NotFoundException(`Tag #${id} no encontrada`);
        return tag;
    }

    async update(id: string, userId: string, updateTagDto: UpdateTagDto): Promise<Tag> {
        const tag = await this.findOne(id, userId);
        Object.assign(tag, updateTagDto);
        return this.tagsRepository.save(tag);
    }

    async remove(id: string, userId: string): Promise<void> {
        const result = await this.tagsRepository.delete({
            id,
            user: { id: userId },
        });
        if (result.affected === 0) throw new NotFoundException(`Tag #${id} no encontrada`);
    }
}