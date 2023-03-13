import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { CategoryService } from './category.service';

@Controller('category')
export class CateogryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('get-category-by-id')
  async getCategoryById(id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @MessagePattern('get-all-categories')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
