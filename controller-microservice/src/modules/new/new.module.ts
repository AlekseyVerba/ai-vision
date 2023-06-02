import { Module, forwardRef } from '@nestjs/common';

//MODULES
import { AppModule } from 'src/app.module';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

//RESOLVERS
import { NewResolver } from './new.resolver';

//SERVICES
import { NewService } from './new.service';

//VALIDATIONS
import { IsNewExistsConstraint } from '../../validations/newExists.validation';

@Module({
  imports: [forwardRef(() => AppModule), FileModule, UserModule],
  providers: [NewService, NewResolver, IsNewExistsConstraint],
})
export class NewModule {}
