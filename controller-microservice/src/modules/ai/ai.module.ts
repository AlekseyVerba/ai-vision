import { Module, forwardRef } from '@nestjs/common';

//RESOLVERS
import { AiResolver } from './ai.resolver';

//SERVICES
import { AiService } from './ai.service';

//MODULES
import { AppModule } from 'src/app.module';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => AppModule), FileModule, UserModule],
  providers: [AiService, AiResolver],
  exports: [AiService],
})
export class AiModule {}
