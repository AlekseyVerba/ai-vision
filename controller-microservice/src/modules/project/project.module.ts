import { forwardRef, Module } from "@nestjs/common";

//RESOLVERS
import { ProjectResolver } from './project.resolver'

//SERVICES
import { ProjectService } from './project.service'

//MODULES
import { AppModule } from "src/app.module";
import { FileModule } from "../file/file.module";

@Module({
    imports: [
        forwardRef(() => AppModule),
        FileModule
    ],
    providers: [ProjectService, ProjectResolver]
})
export class ProjectModule {}