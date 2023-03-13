import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

//MODELS
import { Tag } from 'src/models/tag.model';
import { Project } from 'src/models/project.model';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag)
    private tagRepository: typeof Tag,
  ) {}

  async getOrCreateByName(name: string) {
    return (
      await this.tagRepository.findOrCreate({
        where: { name },
        defaults: { name },
      })
    )[0];
  }

  async getProjectTags(id: number) {
    return await this.tagRepository.findAll({
      include: {
        model: Project,
        required: true,
        where: {
          id,
        },
        attributes: [],
      },
    });
  }
}
