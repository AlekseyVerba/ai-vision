import { Module } from '@nestjs/common';

//CONTROLLERS
import { AiController } from './ai.controller';

//SERVICES
import { AiService } from './ai.service';

//MODULES
import { UtilsModule } from '../utils/utils.module';
import { SequelizeModule } from '@nestjs/sequelize';

//MODELS
import { Ai } from '../../models/ai.model';
import { AiExample } from '../../models/ai_example.model';
import { Category } from '../../models/category.model';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Ai, AiExample, Category])],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
