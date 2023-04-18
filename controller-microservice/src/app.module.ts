import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';

//MODULES
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CategoryModule } from './modules/category/category.module';
import { BadWordsModule } from './modules/bad-words/bad-words.module';
import { JSZipModule } from './modules/jszip/jszip.module';
import { TokenModule } from './modules/token/token.module'

//INTERFACES
import { join } from 'path';
import { GetUser } from './middlewares/get-user.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'assets'),
      exclude: ['/graphql'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),
    ClientsModule.register([
      {
        name: 'DB_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
        },
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, '..', 'src/schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    ProjectModule,
    AuthModule,
    FileModule,
    CategoryModule,
    BadWordsModule,
    JSZipModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUser).forRoutes('*');
  }
}


