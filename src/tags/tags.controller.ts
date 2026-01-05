import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    create(@Body() createTagDto: CreateTagDto, @Request() req) {
        return this.tagsService.create(createTagDto, req.user);
    }

    @Get()
    findAll(@Request() req) {
        return this.tagsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @Request() req) {
        return this.tagsService.update(id, updateTagDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tagsService.remove(id);
    }
}