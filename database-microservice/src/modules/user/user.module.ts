import { forwardRef, Module } from '@nestjs/common';

//MODULES
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from 'src/app.module';

//SERVICES
import { UserService } from './user.service';

//CONTROLLERS
import { UserController } from './user.controller';

//MODELS
import { User } from 'src/models/user.model';
import { UserAvatars } from 'src/models/user_avatars.model';

@Module({
  imports: [
    forwardRef(() => AppModule),
    SequelizeModule.forFeature([User, UserAvatars]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
