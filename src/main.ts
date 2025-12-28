import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 8081;
  await app.listen(port);
  console.log(`Aplicación Zenith Backend corriendo en: http://localhost:${port}`);
}
bootstrap();