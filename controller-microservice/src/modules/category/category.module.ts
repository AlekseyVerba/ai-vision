import { forwardRef, Module } from "@nestjs/common";

//MODULES
import { AppModule } from "src/app.module";

//SERVICES
import { CategoryService } from './category.service'

//VALIDATIONS
import { IsCategoryExistsConstraint } from 'src/validations/categoryExists.validation'


@Module({
    imports: [
        forwardRef(() => AppModule)
    ],
    providers: [
        CategoryService,
        IsCategoryExistsConstraint
    ]
})
export class CategoryModule {}