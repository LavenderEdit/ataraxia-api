import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SettingsModule } from '../settings/settings.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        SettingsModule,
    ],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }