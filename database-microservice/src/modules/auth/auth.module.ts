import { forwardRef, Module } from "@nestjs/common";

//MODULES
import { SequelizeModule } from "@nestjs/sequelize";
import { AppModule } from "src/app.module";
import { UserModule } from 'src/modules/user/user.module'

//SERVICES
import { AuthService } from './auth.service'

//CONTROLLERS
import { AuthController } from './auth.controller'

//MODELS
import { User } from 'src/models/user.model'
import { UserToken } from 'src/models/user_token.model'
import { UserAvatars } from 'src/models/user_avatars.model'

@Module({
    imports: [
        forwardRef(() => AppModule),
        SequelizeModule.forFeature([User, UserToken, UserAvatars]),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}