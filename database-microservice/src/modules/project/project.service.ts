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
import { DeleteProjectFileDto } from './dto/delete-project-file.dto'
import { AddDeleteFavoriteProjectDto } from './dto/add-delete-favorite-project.dto'
import { DeleteProjectDto } from './dto/delete-project.dto'
import { CheckUserAuthorProjectDto } from './dto/check-user-author-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

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
import { UserProjectFavorite } from 'src/models/user_project_favorite.model'

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
    ) { }

    async checkUserAuthorProject({ id, uid }: CheckUserAuthorProjectDto) {
        const project = await this.projectRepository.findByPk(id, {attributes: ['author_uid']})

        return project.author_uid === uid
    }

    async getProjectById(id: number) {
        return await this.projectRepository.findByPk(id)
    }

    async addToFavorite({ id, uid }: AddDeleteFavoriteProjectDto) {
        const currentUserFollowed = await this.userProjectFavoriteRepository.findOne({
            where: {
                user_uid: uid,
                project_id: id
            }
        })

        if (currentUserFollowed) {
            throw new RpcException('You have already added this project to favorite!')
        }

        await this.userProjectFavoriteRepository.create({
            user_uid: uid,
            project_id: id
        })

        return true
    }

    async deleteProject({ id, uid }: DeleteProjectDto) {
        const project = await this.projectRepository.findByPk(id, {
            include: [
                {
                    model: ProjecFile
                },
                {
                    model: ProjectAvatars
                }
            ]
        })

        if (project.author_uid !== uid) {
            throw new RpcException('You can\'t delete this project! You are not an author of this project.')
        }

        await project.destroy()

        return project
    }

    async deleteFromFavorite({ id, uid }: AddDeleteFavoriteProjectDto) {
        const currentUserFollowed = await this.userProjectFavoriteRepository.findOne({
            where: {
                user_uid: uid,
                project_id: id
            }
        })

        if (!currentUserFollowed) {
            throw new RpcException('You have not added this project to favorite!')
        }

        await currentUserFollowed.destroy()

        return true
    }

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
            is_active: true,
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

            const newProject = await this.projectRepository.create({ ...dto, author_uid: uid }, { transaction })

            if (avatars) {
                await this.projectAvatarsRepository.create({ ...avatars, project_id: newProject.id }, { transaction })
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
        } catch (err) {
            transaction.rollback()
            throw new RpcException(err.message)
        }
    }

    async updateProject({ filesPath, avatars, tags, id, uid, ...dto }: UpdateProjectDto) {
        const transaction = await this.projectRepository.sequelize.transaction()

        try {
            const project = (await this.projectRepository.findByPk(id)).update(dto, {transaction})

            if (avatars) {
                await this.projectAvatarsRepository.update(avatars, {
                    where: {
                        project_id:id
                    },
                    transaction
                })
            }

            if (filesPath && filesPath.length) {
                await this.projecFileRepository.bulkCreate(filesPath.map(filePath => ({
                    value: filePath,
                    type: this.utilsService.getFileType(filePath),
                    project_id: id
                })), { transaction })
            }

            if (tags) {

                const addedProjectTagsId = (await this.projectTagRepository.findAll({
                    where: {project_id: id},
                    attributes: ['tag_id']
                })).map(tag => tag.tag_id)

                const existTagsId = (await Promise.all(tags.map(tag => {
                    return this.tagService.getOrCreateByName(tag)
                }))).map(tag => tag.id)

                const existButMustBeAddedIds = existTagsId.filter(tag_id => !addedProjectTagsId.includes(tag_id)).map(tag_id => ({
                    project_id: id,
                    tag_id
                }))
                const mustBeDeletedIds = addedProjectTagsId.filter(tag_id => !existTagsId.includes(tag_id))

                if (mustBeDeletedIds.length) {
                    await this.projectTagRepository.destroy({
                        where: {
                            project_id: id,
                            tag_id: mustBeDeletedIds
                        },
                        transaction
                    })
                }

                if (existButMustBeAddedIds.length) {
                    await this.projectTagRepository.bulkCreate(existButMustBeAddedIds, {transaction})
                }
                
            }

            await transaction.commit()

            return project

        } catch(err) {
            transaction.rollback()
            throw new RpcException(err.message)
        }
    }

    async deleteFileProject({ id, uid }: DeleteProjectFileDto) {
        const file = await this.projecFileRepository.findByPk(id, {
            include: {
                model: Project,
                attributes: ['author_uid']
            }
        })

        if (file.project.author_uid !== uid) {
            throw new RpcException('You can\'t delete file from this project! You are not an author of this project.')
        }

        await file.destroy()

        return file.value
    }

    async getProjectAvatars(id: number) {
        return await this.projectAvatarsRepository.findOne({
            where: {
                project_id: id
            }
        })
    }

    async getProjectFile(id: number) {
        return await this.projecFileRepository.findByPk(id)
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
