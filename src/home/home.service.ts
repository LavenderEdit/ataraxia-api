import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
    getApiInfo() {
        return {
            message: 'Bienvenido a la API de Ataraxia',
            info: {
                name: 'ataraxia-api',
                version: '0.3.6',
                status: 'ONLINE',
                serverTime: new Date().toISOString(),
                description: 'API Backend para la aplicación de productividad Ataraxia'
            }
        };
    }
}