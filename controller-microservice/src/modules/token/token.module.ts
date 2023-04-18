import { Module, forwardRef } from "@nestjs/common";

//SERVICES
import { TokenService } from './token.service'

//RESOLVERS
import { TokenResolver } from './token.resolver'
import { AppModule } from "src/app.module";

//MODULES

@Module({
    imports: [forwardRef(() => AppModule)],
    providers: [TokenService, TokenResolver]
})
export class TokenModule {}