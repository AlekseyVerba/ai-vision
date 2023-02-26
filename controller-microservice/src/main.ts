import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/all-exception.filter';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { join } from 'path';
import { readFileSync } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'ssl', 'certificate.crt')),
    cert: readFileSync(join(__dirname, '..', 'ssl', 'private.key')),
  };

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter)
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.enableCors();

  console.log(join(__dirname, '..', 'ssl', 'private.key'))

  await app.listen(80);
  
}
bootstrap();
