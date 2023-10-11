import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //TODO: delete this on deploy!
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      skipMissingProperties: false,
      whitelist: true,
      transform: true,
    })
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 API gateway microservice is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
