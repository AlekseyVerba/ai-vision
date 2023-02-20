import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//INPUT TYPES
import { CreateProjectInput } from './inputTypes/create-project.input'
import { GetProjectsInput } from './inputTypes/get-projects.input'

//SERVICES
import { FileService } from "../file/file.service";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ProjectService {
    constructor(
        @Inject('DB_MICROSERVICE') private client: ClientProxy,
        private readonly fileService: FileService
    ) {}

    async getProjects(dto: GetProjectsInput) {
        return lastValueFrom(this.client.send('get-projects', dto))
    }

    async createProject({files, avatar ,...dto}: CreateProjectInput) {

        if (files) {
            dto.filesPath = await Promise.all(files.map(async file => {
                const { createReadStream, filename } = await file;
                const stream = createReadStream()
                return this.fileService.uploadFileStream({ file: { stream, filename }, dir: `user/${dto.uid}/projects` })
            }))
        }

        if (avatar) {
            const normalAvatar = await avatar
            const buff = await this.fileService.getBufferFromRead(normalAvatar)
    
            const [defaultImage, middle] = await Promise.all([
                this.fileService.uploadFile({ file: { buff, filename: normalAvatar.filename }, dir: `user/${dto.uid}/projects` }),
                this.fileService.createResizedImage({buff, filename: normalAvatar.filename}, `user/${dto.uid}/projects`, 70, {
                    height: 260,width: 230, options: {
                        fit: 'contain'
                    }
                })
            ])

            dto.avatars = {
                default: defaultImage,
                middle
            }

        }

        return await lastValueFrom(this.client.send('create-project', dto))

    }

    async getProjectAvatars(id: number) {
        return lastValueFrom(this.client.send('get-project-avatars', id))
    }

    async getProjectFiles(id: number) {
        return lastValueFrom(this.client.send('get-project-files', id))
    }

    async getProjectAuthor(id: number) {
        return lastValueFrom(this.client.send('get-project-author', id))
    }

    async getProjectTags(id: number) {
        return lastValueFrom(this.client.send('get-project-tags', id))
    }

    async getProjectCategory(id: number) {
        return lastValueFrom(this.client.send('get-project-category', id))
    }
}