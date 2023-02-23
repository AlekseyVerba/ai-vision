import { forwardRef, Module } from "@nestjs/common";

//MODULES
import { AppModule } from "src/app.module";

//SERVICES
import { CategoryService } from './category.service'

//VALIDATIONS
import { IsCategoryExistsConstraint } from 'src/validations/categoryExists.validation'

//RESOLVERS
import { CategoryResolver } from './category.resolver'

@Module({
    imports: [
        forwardRef(() => AppModule)
    ],
    providers: [
        CategoryService,
        CategoryResolver,
        IsCategoryExistsConstraint
    ]
})
export class CategoryModule {}