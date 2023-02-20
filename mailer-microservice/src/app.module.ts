import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

//MODULES
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module'

//SERVICES
import { AppService } from './app.service';

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env')
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_MAILER,
        secure: false,
        auth: {
          user: process.env.USER_MAILER,
          pass: process.env.PASSWORD_MAILER,
        },
      },
      defaults: {
        from: '<verba.20@bk.ru>',
      }
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MailerModule]
})
export class AppModule {}
