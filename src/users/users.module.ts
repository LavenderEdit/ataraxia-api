import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Setting } from '../settings/entities/setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Setting])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }