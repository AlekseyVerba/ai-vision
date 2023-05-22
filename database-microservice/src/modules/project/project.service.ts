import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

//SERVICES
import { UtilsService } from 'src/modules/utils/utils.service';
import { TagService } from 'src/modules/tag/tag.service';

//SEQUELIZE
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import sequelize from 'sequelize';

//DTO
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { DeleteProjectFileDto } from './dto/delete-project-file.dto';
import { AddDeleteFavoriteProjectDto } from './dto/add-delete-favorite-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { CheckUserAuthorProjectDto } from './dto/check-user-author-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectPrivateFileDto } from './dto/get-project-private-file.dto';
import { GetNextAndPreviousProjectDto } from './dto/get-next-and-previous-project.dto';
import { GetUserProjectByUid } from './dto/get-user-projects-by-uid.dto';
import { GetProjectDto } from './dto/get-project.dto'
import { IsFavoriteDto } from './dto/get-is-favorite.dto'

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant';

//MODELS
import { Project } from 'src/models/project.model';
import { ProjectAvatars } from 'src/models/project_avatars.model';
import { ProjecFile } from 'src/models/project_file.model';
import { ProjectTag } from 'src/models/project_tag.model';
import { User } from 'src/models/user.model';
import { Tag } from 'src/models/tag.model';
import { Category } from 'src/models/category.model';
import { UserProjectFavorite } from 'src/models/user_project_favorite.model';
import { ProjecPrivateFile } from 'src/models/project_private_file.model';
import { UserProjectPrivateFile } from 'src/models/user_project_private_file.model';

@Injectable()
export class ProjectService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly tagService: TagService,

    @InjectModel(Project)
    private projectRepository: typeof Project,

    @InjectModel(ProjectAvatars)
    private projectAvatarsRepository: typeof ProjectAvatars,

    @InjectModel(ProjecFile)
    private projecFileRepository: typeof ProjecFile,

    @InjectModel(ProjectTag)
    private projectTagRepository: typeof ProjectTag,

    @InjectModel(User)
    private userRepository: typeof User,

    @InjectModel(Category)
    private categoryRepository: typeof Category,

    @InjectModel(UserProjectFavorite)
    private userProjectFavoriteRepository: typeof UserProjectFavorite,

    @InjectModel(ProjecPrivateFile)
    private projectPrivateFileRepository: typeof ProjecPrivateFile,

    @InjectModel(UserProjectPrivateFile)
    private userProjectPrivateFileRepository: typeof UserProjectPrivateFile,
  ) {}

  async checkUserAuthorProject({ id, uid }: CheckUserAuthorProjectDto) {
    const project = await this.projectRepository.findByPk(id, {
      attributes: ['author_uid'],
    });

    return project.author_uid === uid;
  }

  async getProjectById({ project_id, uid }: GetProjectDto) {
    return await this.projectRepository.findByPk(project_id)
  }

  async getIsFavorite({ project_id, uid }: IsFavoriteDto) {
    if (!uid) return null 

    return !!(await this.userProjectFavoriteRepository.findOne({
      attributes: ['project_id'],
      where: {
        project_id,
        user_uid: uid
      }
    }))
  }

  async getNextProjectById({
    project_id,
    author_uid,
    category_id,
    uid
  }: GetNextAndPreviousProjectDto) {
    const where: WhereOptions<Project> = {
      id: {
        [Op.gt]: project_id, // assuming you have the current ID of the element
      },
    };

    if (author_uid) {
      where.author_uid = author_uid;
    }

    if (category_id) {
      where.category_id = category_id;
    }

    const result = await this.projectRepository.findOne({
      where,
      order: [
        ['id', 'ASC'], // assuming you want to order by ID in ascending order
      ],
    });

    if (result) return result

    where.id = {
      [Op.lt]: project_id, // assuming you have the current ID of the element
    };

    return await this.projectRepository.findOne({
      where,
      order: [
        ['id', 'ASC'], // assuming you want to order by ID in ascending order
      ],
    })
  }

  async getPreviousProjectById({
    project_id,
    author_uid,
    category_id,
    uid
  }: GetNextAndPreviousProjectDto) {
    const where: any = {
      id: {
        [Op.lt]: project_id, // assuming you have the current ID of the element
      },
    };

    if (author_uid) {
      where.author_uid = author_uid;
    }

    if (category_id) {
      where.category_id = category_id;
    }

    const result = await this.projectRepository.findOne({
      where,
      order: [
        ['id', 'DESC'], // assuming you want to order by ID in ascending order
      ],
    });

    if (result) return result;

    where.id = {
      [Op.gt]: project_id, // assuming you have the current ID of the element
    };

    return await this.projectRepository.findOne({
      where,
      order: [
        ['id', 'DESC'], // assuming you want to order by ID in ascending order
      ],
    })
  }

  async addToFavorite({ id, uid }: AddDeleteFavoriteProjectDto) {
    const currentUserFollowed =
      await this.userProjectFavoriteRepository.findOne({
        where: {
          user_uid: uid,
          project_id: id,
        },
      });

    if (currentUserFollowed) {
      throw new RpcException(
        'You have already added this project to favorite!',
      );
    }

    await this.userProjectFavoriteRepository.create({
      user_uid: uid,
      project_id: id,
    });

    return {value: true};
  }

  async deleteProject({ id, uid }: DeleteProjectDto) {
    const project = await this.projectRepository.findByPk(id, {
      include: [
        {
          model: ProjecFile,
        },
        {
          model: ProjectAvatars,
        },
      ],
    });

    if (project.author_uid !== uid) {
      throw new RpcException(
        "You can't delete this project! You are not an author of this project.",
      );
    }

    await project.destroy();

    return project;
  }

  async deleteFromFavorite({ id, uid }: AddDeleteFavoriteProjectDto) {
    const currentUserFollowed =
      await this.userProjectFavoriteRepository.findOne({
        where: {
          user_uid: uid,
          project_id: id,
        },
      });

    if (!currentUserFollowed) {
      throw new RpcException('You have not added this project to favorite!');
    }

    await currentUserFollowed.destroy();

    return { value: true };
  }

  // async getProject({ id, uid }: GetProjectDto) {
  //   return await this.projectRepository.findByPk(id, {})
  // }

  async getProjects({
    limit,
    offset,
    sort,
    category_id,
    search = '',
    uid,
    favorite,
  }: GetUserProjectByUid) {
    let order;
    let group = [];
    switch (sort) {
      case 'new':
        order = [['createdAt', 'DESC']];
        break;
      case 'old':
        order = [['createdAt', 'ASC']];
        break;
      case 'top':
        order = sequelize.literal(
          '(SELECT COUNT(*) FROM "users_projects_favorite" WHERE "users_projects_favorite"."project_id" = "Project"."id") DESC',
        );
        break;
      default:
        order = [[sequelize.literal('random()')]];
        break;
    }

    const where: any = {
      is_active: true,
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
    };

    if (category_id) {
      where.category_id = category_id;
    }

    if (uid) {
      where.author_uid = uid;
    }

    if (favorite) {
      where[Op.and] = [
        sequelize.where(sequelize.col('users_favorite.uid'), {
          [Op.eq]: uid,
        }),
      ];
    }

    const subquery = await this.projectRepository.findAll({
      attributes: ['id'],
      where,
      include: [
        {
          model: Tag,
          required: false,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'users_favorite',
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      order,
      subQuery: false,
      group,
    });
    const ids = subquery.map((project) => project.id);

    return await this.projectRepository.findAll({
      where: { id: ids },
      include: [
        {
          model: Tag,
          required: false,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      order,
      limit,
      offset,
    });
  }

  async createProject({
    filesPath,
    avatars,
    tags,
    privateFilePath,
    uid,
    ...dto
  }: CreateProjectDto) {
    const transaction = await this.projectRepository.sequelize.transaction();

    try {
      const newProject = await this.projectRepository.create(
        { ...dto, author_uid: uid },
        { transaction },
      );

      avatars = avatars || ({} as any);
      await this.projectAvatarsRepository.create(
        { ...avatars, project_id: newProject.id },
        { transaction },
      );

      if (privateFilePath) {
        const privateFile = await this.projectPrivateFileRepository.create(
          {
            value: privateFilePath,
            project_id: newProject.id,
          },
          { transaction },
        );

        await this.userProjectPrivateFileRepository.create(
          {
            user_uid: uid,
            project_private_file_id: privateFile.id,
          },
          { transaction },
        );
      }

      if (filesPath && filesPath.length) {
        await this.projecFileRepository.bulkCreate(
          filesPath.map((filePath) => ({
            value: filePath,
            type: this.utilsService.getFileType(filePath),
            project_id: newProject.id,
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

        await this.projectTagRepository.bulkCreate(
          existTags.map((tag) => ({
            project_id: newProject.id,
            tag_id: tag.id,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return newProject;
    } catch (err) {
      transaction.rollback();
      throw new RpcException(err.message);
    }
  }

  async updateProject({
    filesPath,
    avatars,
    tags,
    id,
    uid,
    ...dto
  }: UpdateProjectDto) {
    const transaction = await this.projectRepository.sequelize.transaction();

    try {
      const project = (await this.projectRepository.findByPk(id)).update(dto, {
        transaction,
      });

      if (avatars) {
        await this.projectAvatarsRepository.update(avatars, {
          where: {
            project_id: id,
          },
          transaction,
        });
      }

      if (filesPath && filesPath.length) {
        await this.projecFileRepository.bulkCreate(
          filesPath.map((filePath) => ({
            value: filePath,
            type: this.utilsService.getFileType(filePath),
            project_id: id,
          })),
          { transaction },
        );
      }

      if (tags) {
        const addedProjectTagsId = (
          await this.projectTagRepository.findAll({
            where: { project_id: id },
            attributes: ['tag_id'],
          })
        ).map((tag) => tag.tag_id);

        const existTagsId = (
          await Promise.all(
            tags.map((tag) => {
              return this.tagService.getOrCreateByName(tag);
            }),
          )
        ).map((tag) => tag.id);

        const existButMustBeAddedIds = existTagsId
          .filter((tag_id) => !addedProjectTagsId.includes(tag_id))
          .map((tag_id) => ({
            project_id: id,
            tag_id,
          }));
        const mustBeDeletedIds = addedProjectTagsId.filter(
          (tag_id) => !existTagsId.includes(tag_id),
        );

        if (mustBeDeletedIds.length) {
          await this.projectTagRepository.destroy({
            where: {
              project_id: id,
              tag_id: mustBeDeletedIds,
            },
            transaction,
          });
        }

        if (existButMustBeAddedIds.length) {
          await this.projectTagRepository.bulkCreate(existButMustBeAddedIds, {
            transaction,
          });
        }
      }

      await transaction.commit();

      return project;
    } catch (err) {
      transaction.rollback();
      throw new RpcException(err.message);
    }
  }

  async deleteFileProject({ id, uid }: DeleteProjectFileDto) {
    const file = await this.projecFileRepository.findByPk(id, {
      include: {
        model: Project,
        attributes: ['author_uid'],
      },
    });

    if (file.project.author_uid !== uid) {
      throw new RpcException(
        "You can't delete file from this project! You are not an author of this project.",
      );
    }

    await file.destroy();

    return file.value;
  }

  async getProjectAvatars(id: number) {
    return await this.projectAvatarsRepository.findOne({
      where: {
        project_id: id,
      },
    });
  }

  async getProjectFile(id: number) {
    return await this.projecFileRepository.findByPk(id);
  }

  async getProjectFiles(id: number) {
    return await this.projecFileRepository.findAll({
      where: {
        project_id: id,
      },
    });
  }

  async getProjectPrivateFile({ uid, project_id }: GetProjectPrivateFileDto) {
    return await this.projectPrivateFileRepository.findOne({
      where: {
        project_id,
      },
      include: [
        {
          model: User,
          where: { uid: uid || null },
          attributes: [],
          required: true,
        },
      ],
    });
  }

  async getProjectAuthor(id: number) {
    return await this.userRepository.findOne({
      include: [
        {
          model: Project,
          as: 'projects',
          where: {
            id,
          },
          required: true,
          attributes: [],
        },
      ],
    });
  }

  async getProjectCategory(id: number) {
    return await this.categoryRepository.findOne({
      include: [
        {
          model: Project,
          as: 'projects',
          where: {
            id,
          },
          required: true,
          attributes: [],
        },
      ],
    });
  }
}
