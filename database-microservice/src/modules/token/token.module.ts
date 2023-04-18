import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

//MODELS
import { UserToken } from '../../models/user_token.model'

//MODULES
import { AppModule } from "src/app.module";

//CONTROLLERS
import { TokenController } from './token.controller'

//SERVICES
import { TokenService } from './token.service'

@Module({
    imports: [
        forwardRef(() => AppModule),
        SequelizeModule.forFeature([UserToken]),
    ],
    controllers: [TokenController],
    providers: [TokenService]
})
export class TokenModule {}