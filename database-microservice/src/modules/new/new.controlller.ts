import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { NewService } from './new.service';

//DTO
import { CreateNewDTO } from './dto/create-new.dto';
import { AddDeleteFavoriteNewInput } from './dto/add-delete-favorite-new.input';
import { GetNewsDto } from './dto/get-news.dto';
import { IsNewFavoriteDto } from './dto/get-is-favorite.dto';

@Controller('new')
export class NewController {
  constructor(private readonly newService: NewService) {}

  @MessagePattern('get-news')
  async getNews(dto: GetNewsDto) {
    return await this.newService.getNews(dto);
  }

  @MessagePattern('get-user-favorite-news')
  async getUserFavoriteNews(uid: string) {
    return await this.newService.getUserFavoriteNews(uid);
  }

  @MessagePattern('get-new-files')
  async getNewFiles(id: string) {
    return await this.newService.getNewFiles(id);
  }

  @MessagePattern('create-new')
  async createNew(dto: CreateNewDTO) {
    return await this.newService.createNew(dto);
  }

  @MessagePattern('get-new')
  async getNew(id: string) {
    return await this.newService.getNew(id);
  }

  @MessagePattern('delete-new')
  async deleteNew(id: string) {
    return await this.newService.deleteNew(id);
  }

  @MessagePattern('add-new-to-favorite')
  async addNewToFavorite(dto: AddDeleteFavoriteNewInput) {
    return await this.newService.addNewToFavorite(dto);
  }

  @MessagePattern('delete-new-from-favorite')
  async deleteNewFromFavorite(dto: AddDeleteFavoriteNewInput) {
    return await this.newService.deleteNewFromFavorite(dto);
  }

  @MessagePattern('get-new-is-favorite')
  async getIsFavorite(dto: IsNewFavoriteDto) {
    return this.newService.getIsFavorite(dto);
  }
}
