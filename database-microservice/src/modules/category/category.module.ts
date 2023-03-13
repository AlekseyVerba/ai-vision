import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

//CONTROLLERS
import { CateogryController } from './category.controller';

//SERVICES
import { CategoryService } from './category.service';

//MODELS
import { Category } from 'src/models/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [CateogryController],
  providers: [CategoryService],
})
export class CategoryModule {}
