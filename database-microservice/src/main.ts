import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 3000,
    },
  });
  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();
}
bootstrap();
