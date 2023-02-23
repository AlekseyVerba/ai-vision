import { Query ,Resolver } from '@nestjs/graphql'
import { UseGuards, UsePipes } from '@nestjs/common'

//MODELS
import { Category } from './models/category.model'

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator'

//PIPES
import { ValidationPipe } from 'src/pipes/validation.pipe'

//SERVICES
import { CategoryService } from './category.service'

@Resolver(of => Category)
@UsePipes(new ValidationPipe())
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(returns => [Category!], { description: 'Get all categories' })
  async getAllCategories() {
    return await this.categoryService.getAllCategories()
  }
}