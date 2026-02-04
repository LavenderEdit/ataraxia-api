import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TimersModule } from './timers/timers.module';
import { TagsModule } from './tags/tags.module';
import { SettingsModule } from './settings/settings.module';
import { HomeModule } from './home/home.module';
import { dataSourceOptions } from './database/data-source';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Seguridad: Rate Limiting 
    // Límite: 10 peticiones (limit) cada 60 segundos (ttl) por IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Base de Datos
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),

    // Módulos de la Aplicación
    AuthModule,
    UsersModule,
    TasksModule,
    TimersModule,
    TagsModule,
    SettingsModule,
    HomeModule,
    GamificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }