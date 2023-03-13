import { forwardRef, Module } from '@nestjs/common';

//SERVICES
import { UserService } from './user.service';

//RESOLVERS
import { UserResolver } from './user.resolver';

//MODULES
import { AppModule } from 'src/app.module';
import { FileModule } from 'src/modules/file/file.module';

//VALIDATIONS
import { IsUserNotExistByEmailConstraint } from 'src/validations/userNotExistByEmail.validation';
import { IsUserNotExistByNameConstraint } from 'src/validations/userNotExistByName.validation';
import { IsUserExistByEmailConstraint } from 'src/validations/userExistByEmail.validation';

@Module({
  imports: [forwardRef(() => AppModule), FileModule],
  providers: [
    UserService,
    UserResolver,
    IsUserNotExistByEmailConstraint,
    IsUserNotExistByNameConstraint,
    IsUserExistByEmailConstraint,
  ],
  exports: [UserService],
})
export class UserModule {}
