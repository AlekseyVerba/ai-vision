import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

//CONTROLLERS
import { TagController } from './tag.controllers'

//SERVICES
import { TagService } from './tag.service'

//MODELS
import { Tag } from 'src/models/tag.model'

@Module({
    imports: [
        SequelizeModule.forFeature([
            Tag
        ])
    ],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})
export class TagModule {}