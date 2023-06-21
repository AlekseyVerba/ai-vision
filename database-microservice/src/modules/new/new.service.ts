import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

//SEQUELIZE
import { Op, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';

//MODELS
import { New } from '../../models/new.model';
import { NewFile } from '../../models/new_file.model';
import { NewTag } from '../../models/new_tag.model';
import { UserNewFavorite } from '../../models/user_new_favorite.model';
import { Tag } from 'src/models/tag.model';

//DTO
import { CreateNewDTO } from './dto/create-new.dto';
import { AddDeleteFavoriteNewInput } from './dto/add-delete-favorite-new.input';
import { GetNewsDto } from './dto/get-news.dto';
import { IsNewFavoriteDto } from './dto/get-is-favorite.dto';

//SERVICES
import { UtilsService } from '../utils/utils.service';
import { TagService } from '../tag/tag.service';
import { User } from 'src/models/user.model';

@Injectable()
export class NewService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly tagService: TagService,

    @InjectModel(New)
    private newRepository: typeof New,

    @InjectModel(NewFile)
    private newFileRepository: typeof NewFile,

    @InjectModel(NewTag)
    private newTagRepository: typeof NewTag,

    @InjectModel(UserNewFavorite)
    private userNewFavoriteRepository: typeof UserNewFavorite,
  ) { }

  async createNew({ previewPath, filesPath, uid, tags, pdfPath, ...dto }: CreateNewDTO) {
    const transaction = await this.newRepository.sequelize.transaction();

    try {
      const newNew = await this.newRepository.create(
        { ...dto, preview: previewPath, pdf: pdfPath },
        { transaction },
      );

      if (filesPath && filesPath.length) {
        await this.newFileRepository.bulkCreate(
          filesPath.map((filePath) => ({
            value: filePath,
            type: this.utilsService.getFileType(filePath),
            new_id: newNew.id,
          })),
          { transaction },
        );
      }

      if (tags && tags.length) {
        const existTags = await Promise.all(
          tags.map((tag) => {
            return this.tagService.getOrCreateByName(tag);
          }),
        );

        await this.newTagRepository.bulkCreate(
          existTags.map((tag) => ({
            new_id: newNew.id,
            tag_id: tag.id,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return newNew;
    } catch (err) {
      transaction.rollback();
      console.log(err.message);
      throw new RpcException(err.message);
    }
  }

  async getNew(id: string) {
    return await this.newRepository.findByPk(id);
  }

  async deleteNew(id: string) {
    const oldNew = await this.newRepository.findByPk(id, {
      include: [
        {
          model: NewFile,
        },
      ],
    });

    await oldNew.destroy();

    return oldNew;
  }

  async addNewToFavorite({ id, uid }: AddDeleteFavoriteNewInput) {
    const currentUserFollowed = await this.userNewFavoriteRepository.findOne({
      where: {
        user_uid: uid,
        new_id: id,
      },
    });

    if (currentUserFollowed) {
      throw new RpcException('You have already added this new to favorite!');
    }

    await this.userNewFavoriteRepository.create({
      user_uid: uid,
      new_id: id,
    });

    return { value: true };
  }

  async deleteNewFromFavorite({ id, uid }: AddDeleteFavoriteNewInput) {
    const currentUserFollowed = await this.userNewFavoriteRepository.findOne({
      where: {
        user_uid: uid,
        new_id: id,
      },
    });

    if (!currentUserFollowed) {
      throw new RpcException('You have not added this new to favorite!');
    }

    await currentUserFollowed.destroy();

    return { value: true };
  }

  async getNews({ limit, offset, search  = ''}: GetNewsDto) {

    const subquery = await this.newRepository.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          sequelize.where(sequelize.col('tags.name'), {
            [Op.iLike]: `%${search}%`,
          }),
        ],
      },
      include: [
        {
          model: Tag,
          required: false,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        }
      ],
      order: [['createdAt', 'DESC']],
      subQuery: false
    });

    const ids = subquery.map((newObj) => newObj.id);

    return await this.newRepository.findAll({
      where: {
        id: ids
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async getUserFavoriteNews(uid: string) {
    return await this.newRepository.findAll({
      include: [
        {
          model: User,
          where: {
            uid,
          },
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  async getNewFiles(id: string) {
    return await this.newFileRepository.findAll({
      where: {
        new_id: id,
      },
    });
  }

  async getNewTags(id: string) {
    return await this.tagService.getNewTags(id);
  }

  async getIsFavorite({ new_id, uid }: IsNewFavoriteDto) {
    if (!uid) return null;

    return !!(await this.userNewFavoriteRepository.findOne({
      attributes: ['new_id'],
      where: {
        new_id,
        user_uid: uid,
      },
    }));
  }
}
