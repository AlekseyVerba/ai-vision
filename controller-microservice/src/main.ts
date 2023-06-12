import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/all-exception.filter';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as https from 'https';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'ssl', 'private.key')),
    cert: readFileSync(join(__dirname, '..', 'ssl', 'certificate.crt')),
  };

  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.enableCors();

  await app.init();

  http.createServer(server).listen(443);
  // https.createServer(httpsOptions, server).listen(443);
}

bootstrap();
