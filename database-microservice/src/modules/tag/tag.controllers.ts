import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('get-project-tags')
  async getProjectTags(id: number) {
    return this.tagService.getProjectTags(id);
  }

  @MessagePattern('get-new-tags')
  async getNewTags(id: string) {
    return await this.tagService.getNewTags(id);
  }
}
