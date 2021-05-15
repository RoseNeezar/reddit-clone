import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.set('trust proxy', 1);
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3010',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', '*'],
  });
  await app.listen(5000);
}
bootstrap();
