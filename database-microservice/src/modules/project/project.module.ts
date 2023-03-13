import { forwardRef, Module } from '@nestjs/common';

//MODULES
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { TagModule } from 'src/modules/tag/tag.module';

//CONTROLLERS
import { ProjectController } from './project.controller';

//SERVICES
import { ProjectService } from './project.service';

//MODELS
import { Project } from 'src/models/project.model';
import { ProjectAvatars } from 'src/models/project_avatars.model';
import { ProjecFile } from 'src/models/project_file.model';
import { ProjectTag } from 'src/models/project_tag.model';
import { User } from 'src/models/user.model';
import { Category } from 'src/models/category.model';
import { UserProjectFavorite } from 'src/models/user_project_favorite.model';
import { ProjecPrivateFile } from 'src/models/project_private_file.model';
import { UserProjectPrivateFile } from 'src/models/user_project_private_file.model';

@Module({
  imports: [
    UtilsModule,
    TagModule,
    SequelizeModule.forFeature([
      Project,
      ProjectAvatars,
      ProjecFile,
      ProjectTag,
      User,
      Category,
      UserProjectFavorite,
      ProjecPrivateFile,
      UserProjectPrivateFile,
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
