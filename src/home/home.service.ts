import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
    getApiInfo() {
        return {
            message: 'Bienvenido a la API de Ataraxia',
            info: {
                name: 'ataraxia-api',
                version: '0.0.1',
                status: 'running',
                serverTime: new Date().toISOString(),
                description: 'API backend construida con NestJS'
            }
        };
    }
}