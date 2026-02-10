import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

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
import { GoogleDriveModule } from './google-drive/google-drive.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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

    // --- Configuración SMTP para v0.3 (Nuevo) ---
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false, // true para puerto 465, false para otros (587)
          auth: {
            user: configService.get('GMAIL_APP_EMAIL'),
            pass: configService.get('GMAIL_APP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Ataraxia Support" <${configService.get('GMAIL_APP_EMAIL')}>`,
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Módulos
    AuthModule,
    UsersModule,
    TasksModule,
    TimersModule,
    TagsModule,
    SettingsModule,
    HomeModule,
    GamificationModule,
    GoogleDriveModule,
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