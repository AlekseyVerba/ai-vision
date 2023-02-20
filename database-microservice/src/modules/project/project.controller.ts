import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

//SERVICES
import { ProjectService } from './project.service'

//DTO
import { CreateProjectDto } from './dto/create-project.dto'
import { GetProjectsDto } from './dto/get-projects.dto'

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ) {}

    @MessagePattern('get-projects')
    async getProjects(dto: GetProjectsDto) {
        return this.projectService.getProjects(dto)
    }

    @MessagePattern('create-project')
    async createProject(dto: CreateProjectDto) {
        return this.projectService.createProject(dto)
    }

    @MessagePattern('get-project-avatars')
    async getProjectAvatars(id: number) {
        return this.projectService.getProjectAvatars(id)
    }

    @MessagePattern('get-project-files')
    async getProjectFiles(id: number) {
        return this.projectService.getProjectFiles(id)
    }

    @MessagePattern('get-project-author')
    async getProjectAuthor(id: number) {
        return this.projectService.getProjectAuthor(id)
    }

    @MessagePattern('get-project-category')
    async getProjectCategory(id: number) {
        return this.projectService.getProjectCategory(id)
    }
}