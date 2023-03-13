import { forwardRef, Module } from '@nestjs/common';

//RESOLVERS
import { ProjectResolver } from './project.resolver';

//SERVICES
import { ProjectService } from './project.service';

//MODULES
import { AppModule } from 'src/app.module';
import { FileModule } from '../file/file.module';

//VALIDATIONS
import { IsProjectFileExistsConstraint } from 'src/validations/projectFileExists.validation';
import { IsProjectExistsConstraint } from 'src/validations/projectExists.validation';

@Module({
  imports: [forwardRef(() => AppModule), FileModule],
  providers: [
    ProjectService,
    ProjectResolver,
    IsProjectFileExistsConstraint,
    IsProjectExistsConstraint,
  ],
})
export class ProjectModule {}
