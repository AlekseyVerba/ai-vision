import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseGuards, UsePipes } from "@nestjs/common";

//GUARDS
import { AuthGuard } from 'src/guards/auth.guard'

//MODELS
import { Project } from './models/project.model'
import { ProjectAvatars } from "./models/project-avatars.model";
import { ProjectFile } from "./models/project-file.model";
import { User } from "../user/models/user.model";
import { Tag } from "../tag/models/tag.model";
import { Category } from "../category/models/category.model";

//SERVICES
import { ProjectService } from './project.service'

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator'

//INPUT TYPES
import { CreateProjectInput } from './inputTypes/create-project.input'
import { GetProjectsInput } from './inputTypes/get-projects.input'
import { DeleteFileInput } from './inputTypes/delete-file.input'
import { AddDeleteFavoriteProjectInput } from './inputTypes/add-delete-favorite-project.input'
import { DeleteProjectInput } from './inputTypes/delete-project.input'
import { UpdateProjectInput } from './inputTypes/update-project.input'

//PIPES
import { ValidationPipe } from "src/pipes/validation.pipe";

@Resolver(of => Project)
@UsePipes(new ValidationPipe())
export class ProjectResolver {
    constructor(
        private readonly projectService: ProjectService
    ) {}

    @Query(returns => [Project!], { description: 'Get projects' })
    @UseGuards(AuthGuard)
    async getProjects(
      @Args('getProjectData') getProjectData: GetProjectsInput
    ) {
      return await this.projectService.getProjects(getProjectData)
    }

    @Mutation(returns => Boolean, { description: 'Add project to favorite projects' })
    @UseGuards(AuthGuard)
    async addToFavorite(
      @UserProperty('uid') uid: string,
      @Args('addToFavoriteData') addToFavoriteData: AddDeleteFavoriteProjectInput
    ) {
      addToFavoriteData.uid = uid
      return await this.projectService.addToFavorite(addToFavoriteData)
    }

    @Mutation(returns => Boolean, { description: 'Delete project from favorite projects' })
    @UseGuards(AuthGuard)
    async deleteFromFavorite(
      @UserProperty('uid') uid: string,
      @Args('deleteFromFavoriteData') deleteFromFavoriteData: AddDeleteFavoriteProjectInput
    ) {
      deleteFromFavoriteData.uid = uid
      return await this.projectService.deleteFromFavorite(deleteFromFavoriteData)
    }

    @Mutation(returns => Boolean, { description: 'Delete file from project' })
    @UseGuards(AuthGuard)
    async deleteFile(
      @UserProperty('uid') uid: string,
      @Args('deleteFileData') deleteFileData: DeleteFileInput
    ) {
      deleteFileData.uid = uid
      return await this.projectService.deleteFileProject(deleteFileData)
    }

    @Mutation(returns => Boolean, { description: 'Delete project' })
    @UseGuards(AuthGuard)
    async deleteProject(      
      @UserProperty('uid') uid: string,
      @Args('deleteProjectData') deleteProjectData: DeleteProjectInput
    ) {
      deleteProjectData.uid = uid
      return await this.projectService.deleteProject(deleteProjectData)
    }

    @Mutation(returns => Project, { description: 'Update project' })
    @UseGuards(AuthGuard)
    async updateProject(
      @UserProperty('uid') uid: string,
      @Args('updateProjectData') updateProjectData: UpdateProjectInput
    ) {
      updateProjectData.uid = uid
      return await this.projectService.updateProject(updateProjectData)
    }

    @Mutation(returns => Project, { description: 'Create project' })
    @UseGuards(AuthGuard)
    async createProject(
        @UserProperty('uid') uid: string,
        @Args('createProjectData') createProjectData: CreateProjectInput
    ) {
        createProjectData.uid = uid
        return await this.projectService.createProject(createProjectData)
    }

    @ResolveField(() => ProjectAvatars, { description: 'Get project avatars' })
    async avatars(@Parent() { id }: Project) {
      return await this.projectService.getProjectAvatars(id)
    }

    @ResolveField(() => ProjectFile, { description: 'Get project\'s files'})
    async files(@Parent() { id }: Project) {
      return await this.projectService.getProjectFiles(id)
    }

    @ResolveField(() => User, {description: 'Get project\'s author'})
    async author(@Parent() { id }: Project) {
      return await this.projectService.getProjectAuthor(id)
    }

    @ResolveField(() => Tag, {description: 'Get project\'s tags'})
    async tags(@Parent() { id }: Project) {
      return await this.projectService.getProjectTags(id)
    }

    @ResolveField(() => Category, {description: 'Get project\'s category'})
    async category(@Parent() { id }: Project) {
      return await this.projectService.getProjectCategory(id)
    }

}