import { forwardRef, Module } from "@nestjs/common";

//MODULES
import { AppModule } from '../app.module'

//CONTROLLERS
import { AuthController } from './auth.controller'

//SERVICES
import { AuthService } from './auth.service'

@Module({
    imports: [
        forwardRef(() => AppModule)
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}