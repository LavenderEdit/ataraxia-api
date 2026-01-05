import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,
    ) { }

    async create(createTagDto: CreateTagDto, user: User) {
        const tag = this.tagsRepository.create({
            ...createTagDto,
            user,
        });
        return this.tagsRepository.save(tag);
    }

    async findAll(user: User) {
        return this.tagsRepository.find({ where: { user: { id: user.id } } });
    }

    async findOne(id: string) {
        return this.tagsRepository.findOne({ where: { id } });
    }

    async update(id: string, updateTagDto: UpdateTagDto) {
        if (Object.keys(updateTagDto).length === 0) {
            return this.tagsRepository.findOne({ where: { id } });
        }
        await this.tagsRepository.update(id, updateTagDto);
        return this.tagsRepository.findOne({ where: { id } });
    }

    async remove(id: string) {
        return this.tagsRepository.delete(id);
    }
}