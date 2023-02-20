import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

//MODELS
import { Category } from 'src/models/category.model'

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category)
        private categoryRepository: typeof Category,
    ) {}

    async getCategoryById(id: number) {
        return await this.categoryRepository.findByPk(id)
    }
}