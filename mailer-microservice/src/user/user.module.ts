import { Module } from '@nestjs/common';

//CONTROLLERS
import { UserController } from './user.controller';

//SERVICES
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
