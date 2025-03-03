import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptor/LoggerInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
