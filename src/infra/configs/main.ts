import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app/app.module';
import { SwaggerConfig } from './docs/swagger/swagger.config';
import { AppDataSource } from '@infra/database/typeorm/data-source';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppDataSource.initialize();
  app.setGlobalPrefix('api/v1');
  SwaggerConfig.config(app);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
