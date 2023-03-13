import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { join } from 'path';

//MODULES
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { CategoryModule } from './modules/category/category.module';
import { UtilsModule } from './modules/utils/utils.module';
import { TagModule } from './modules/tag/tag.module';

//MODELS
import { User } from './models/user.model';
import { UserAvatars } from './models/user_avatars.model';
import { Project } from './models/project.model';
import { ProjectTag } from './models/project_tag.model';
import { Category } from './models/category.model';
import { Tag } from './models/tag.model';
import { UserProjectFavorite } from './models/user_project_favorite.model';
import { UserToken } from './models/user_token.model';
import { ProjectAvatars } from './models/project_avatars.model';
import { ProjecFile } from './models/project_file.model';
import { ProjecPrivateFile } from './models/project_private_file.model';
import { UserProjectPrivateFile } from './models/user_project_private_file.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),
    ClientsModule.register([
      {
        name: 'MAILER_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MAILER_HOST,
          port: Number(process.env.MAILER_PORT),
        },
      },
    ]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        UserAvatars,
        Project,
        ProjectTag,
        Category,
        Tag,
        UserProjectFavorite,
        UserToken,
        ProjectAvatars,
        ProjecFile,
        ProjecPrivateFile,
        UserProjectPrivateFile,
      ],
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    CategoryModule,
    UtilsModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule],
})
export class AppModule {}
