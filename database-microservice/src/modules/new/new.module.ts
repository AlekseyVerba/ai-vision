import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

//CONTROLLERS
import { NewController } from './new.controlller';

//SERVICES
import { NewService } from './new.service';

//MODELS
import { New } from '../../models/new.model';
import { NewFile } from '../../models/new_file.model';
import { NewTag } from '../../models/new_tag.model';
import { UserNewFavorite } from '../../models/user_new_favorite.model';

//MODULES
import { UtilsModule } from '../utils/utils.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    SequelizeModule.forFeature([New, NewFile, NewTag, UserNewFavorite]),
    UtilsModule,
    TagModule,
  ],
  controllers: [NewController],
  providers: [NewService],
})
export class NewModule {}
