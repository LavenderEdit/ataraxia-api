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
    create(@Request() req, @Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(req.user.sub, createTagDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.tagsService.findAll(req.user.sub);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
        return this.tagsService.update(id, req.user.sub, updateTagDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.tagsService.remove(id, req.user.sub);
    }
}