import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { ProjectService } from './project.service';

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

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern('check-user-author-project')
  async checkUserAuthorProject(dto: CheckUserAuthorProjectDto) {
    return this.projectService.checkUserAuthorProject(dto);
  }

  @MessagePattern('get-projects')
  async getProjects(dto: GetProjectsDto) {
    return this.projectService.getProjects(dto);
  }

  @MessagePattern('get-user-projects')
  async getUserProjects(dto: GetUserProjectByUid) {
    return this.projectService.getProjects(dto);
  }

  @MessagePattern('get-user-favorite-projects')
  async getUserFavoriteProjects(dto: GetUserProjectByUid) {
    return this.projectService.getProjects({ ...dto, favorite: true });
  }

  @MessagePattern('get-project-private-file')
  async getProjectPrivateFile(dto: GetProjectPrivateFileDto) {
    return this.projectService.getProjectPrivateFile(dto);
  }

  @MessagePattern('update-project')
  async updateProject(dto: UpdateProjectDto) {
    return this.projectService.updateProject(dto);
  }

  @MessagePattern('create-project')
  async createProject(dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @MessagePattern('get-project-avatars')
  async getProjectAvatars(id: number) {
    return this.projectService.getProjectAvatars(id);
  }

  @MessagePattern('delete-project')
  async deleteProject(dto: DeleteProjectDto) {
    return this.projectService.deleteProject(dto);
  }

  @MessagePattern('add-to-favorite')
  async addToFavorite(dto: AddDeleteFavoriteProjectDto) {
    return this.projectService.addToFavorite(dto);
  }

  @MessagePattern('delete-from-favorite')
  async deleteFromFavorite(dto: AddDeleteFavoriteProjectDto) {
    return this.projectService.deleteFromFavorite(dto);
  }

  @MessagePattern('get-project-by-id')
  async getProjectById(dto: GetProjectDto) {
    return this.projectService.getProjectById(dto);
  }

  @MessagePattern('get-next-project-by-id')
  async getNextProjectById(dto: GetNextAndPreviousProjectDto) {
    return this.projectService.getNextProjectById(dto);
  }

  @MessagePattern('get-previous-project-by-id')
  async getPreviousProjectById(dto: GetNextAndPreviousProjectDto) {
    return this.projectService.getPreviousProjectById(dto);
  }

  @MessagePattern('delete-file-project')
  async deleteFileProject(dto: DeleteProjectFileDto) {
    return this.projectService.deleteFileProject(dto);
  }

  @MessagePattern('get-project-file')
  async getProjectFile(id: number) {
    return this.projectService.getProjectFile(id);
  }

  @MessagePattern('get-project-files')
  async getProjectFiles(id: number) {
    return this.projectService.getProjectFiles(id);
  }

  @MessagePattern('get-project-author')
  async getProjectAuthor(id: number) {
    return this.projectService.getProjectAuthor(id);
  }

  @MessagePattern('get-project-category')
  async getProjectCategory(id: number) {
    return this.projectService.getProjectCategory(id);
  }
}
