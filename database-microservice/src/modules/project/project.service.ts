import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

//SERVICES
import { UtilsService } from 'src/modules/utils/utils.service'
import { TagService } from 'src/modules/tag/tag.service'

//SEQUELIZE
import { InjectModel } from "@nestjs/sequelize";
import { Op } from 'sequelize';
import sequelize from 'sequelize';

//DTO
import { CreateProjectDto } from './dto/create-project.dto'
import { GetProjectsDto } from './dto/get-projects.dto'

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant'

//MODELS
import { Project } from 'src/models/project.model'
import { ProjectAvatars } from 'src/models/project_avatars.model'
import { ProjecFile } from 'src/models/project_file.model'
import { ProjectTag } from 'src/models/project_tag.model'
import { User } from 'src/models/user.model'
import { Tag } from "src/models/tag.model";
import { Category } from "src/models/category.model";

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
    ) {}

    async getProjects({ limit, offset, sort, category_id, search = '' }: GetProjectsDto) {

        let seqFn
        let group = []
        switch (sort) {
            case 'date':
                seqFn = [['createdAt', 'DESC']]
                break;
        
            case 'top':
                seqFn = [[sequelize.fn('count', sequelize.col('users_favorite.UserProjectFavorite.user_uid')), 'DESC']]
                group = ['Project.id', 'users_favorite->UserProjectFavorite.user_uid', 'users_favorite->UserProjectFavorite.project_id']
                break;
            default:
                seqFn = [['createdAt', 'DESC']]
                break;
        }

        const ObjWhere: any = {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                sequelize.where(sequelize.col('tags.name'), { [Op.iLike]: `%${search}%` })
            ]
        }

        if (category_id) ObjWhere.category_id = category_id

        return await this.projectRepository.findAll({
            where: ObjWhere,
            include: [
                {
                    model: Tag,
                    required: false,
                    attributes: [],
                    through: {
                      attributes: []
                    }
                },
                {
                    model: User,
                    as: 'users_favorite',
                    attributes: []
                }
            ],
            order: seqFn,
            limit,
            offset,
            subQuery: false,
            group
        })
    }

    async createProject({ filesPath, avatars, tags, uid, ...dto }: CreateProjectDto) {
        const transaction = await this.projectRepository.sequelize.transaction()

        try {

            const newProject = await this.projectRepository.create({...dto, author_uid: uid}, { transaction })
            
            if (avatars) {
                await this.projectAvatarsRepository.create({...avatars, project_id: newProject.id}, { transaction })
            }

            if (filesPath && filesPath.length) {
                await this.projecFileRepository.bulkCreate(filesPath.map(filePath => ({
                    value: filePath,
                    type: this.utilsService.getFileType(filePath),
                    project_id: newProject.id
                })), { transaction })
            }

            if (tags && tags.length) {

                const existTags = await Promise.all(tags.map(tag => {
                    return this.tagService.getOrCreateByName(tag)
                }))

                await this.projectTagRepository.bulkCreate(existTags.map(tag => ({
                    project_id: newProject.id,
                    tag_id: tag.id
                })), { transaction })
            }

            await transaction.commit()


            return newProject
        } catch(err) {
            transaction.rollback()
            throw new RpcException(err.message)
        }
    }

    async getProjectAvatars(id: number) {
        return await this.projectAvatarsRepository.findOne({
            where: {
                project_id: id
            }
        })
    }

    async getProjectFiles(id: number) {
        return await this.projecFileRepository.findAll({
            where: {
                project_id: id
            }
        })
    }

    async getProjectAuthor(id: number) {
        return await this.userRepository.findOne({
            include: [
                {
                    model: Project,
                    as: 'projects',
                    where: {
                        id
                    },
                    required: true,
                    attributes: []
                }
            ]
        })
    }

    async getProjectCategory(id: number) {
        return await this.categoryRepository.findOne({
            include: [
                {
                    model: Project,
                    as: 'projects',
                    where: {
                        id
                    },
                    required: true,
                    attributes: []
                }
            ]
        })
    }
}
