import { forwardRef, Module } from "@nestjs/common";

//MODULES
import { AppModule } from "src/app.module";

//RESOLVERS
import { AuthResolver } from './auth.resolver'

//SERVICES
import { AuthService } from './auth.service'

@Module({
    imports: [
        forwardRef(() => AppModule)
    ],
    providers: [AuthService, AuthResolver]
})
export class AuthModule {}