import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Etiquetas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @ApiOperation({ summary: 'Crear etiqueta' })
    @Post()
    create(@Body() createTagDto: CreateTagDto, @Request() req) {
        return this.tagsService.create(createTagDto, req.user);
    }

    @ApiOperation({ summary: 'Listar todas las etiquetas' })
    @Get()
    findAll(@Request() req) {
        return this.tagsService.findAll(req.user);
    }

    @ApiOperation({ summary: 'Obtener etiqueta por ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar etiqueta' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @Request() req) {
        return this.tagsService.update(id, updateTagDto);
    }

    @ApiOperation({ summary: 'Eliminar etiqueta' })
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tagsService.remove(id);
    }
}