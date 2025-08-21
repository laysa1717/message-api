import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './presentation/http/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', 
    methods: process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: process.env.ALLOW_CREDENTIALS === 'true',
  };

  app.enableCors(corsOptions);

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
