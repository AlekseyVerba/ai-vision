import { UseGuards, UsePipes } from '@nestjs/common';
import {
  Query,
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

//MODELS
import { New } from './models/new.model';
import { NewFile } from './models/new_file.model';
import { Tag } from '../tag/models/tag.model';

//PIPES
import { ValidationPipe } from 'src/pipes/validation.pipe';

//SERVICES
import { NewService } from './new.service';

//DECORATORS
import { Roles, RolesEnum } from 'src/decorators/roles.decorator';
import { UserProperty } from 'src/decorators/user-property.decorator';

//GUARDS
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';

//INPUTS
import { CreateNewInput } from './inputTypes/create-new.input';
import { DeleteNewInput } from './inputTypes/delete-new.input';
import { AddDeleteFavoriteNewInput } from './inputTypes/add-delete-favorite-new.input';
import { GetNewsInput } from './inputTypes/get-news.input';
import { GetNewInput } from './inputTypes/get-new.input';

//QUERIES
import { Success } from '../auth/queriesTypes/succes.query';

@Resolver((of) => New)
@UsePipes(new ValidationPipe())
@UseGuards(RolesGuard)
export class NewResolver {
  constructor(private readonly newService: NewService) {}

  @Query((returns) => [New], { description: 'Get news' })
  async getNews(@Args('newsQueryData') getNewsData: GetNewsInput) {
    return await this.newService.getNews(getNewsData);
  }

  @Query((returns) => New, { description: 'Get new' })
  async getNew(@Args('newQueryData') { id }: GetNewInput) {
    return await this.newService.getNewById(id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => [New], { description: 'Get user favorite news' })
  async getUserFavoriteNews(@UserProperty('uid') uid: string) {
    return await this.newService.getUserFavoriteNews(uid);
  }

  @Mutation((returns) => New, { description: 'Create new' })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard)
  async createNew(
    @UserProperty('uid') uid: string,
    @Args('createNewData') createNewData: CreateNewInput,
  ) {
    createNewData.uid = uid;
    return await this.newService.createNew(createNewData);
  }

  @Mutation((returns) => Success, { description: 'Delete new' })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard)
  async deleteNew(@Args('deleteNewData') { id }: DeleteNewInput) {
    return await this.newService.deleteNew(id);
  }

  @Mutation((returns) => Success, {
    description: 'Add new to favorite news',
  })
  @UseGuards(AuthGuard)
  async addNewToFavorite(
    @UserProperty('uid') uid: string,
    @Args('addNewToFavoriteData')
    addNewToFavoriteData: AddDeleteFavoriteNewInput,
  ) {
    addNewToFavoriteData.uid = uid;
    return await this.newService.addNewToFavorite(addNewToFavoriteData);
  }

  @Mutation((returns) => Success, {
    description: 'Delete new from favorite news',
  })
  @UseGuards(AuthGuard)
  async deleteNewFromFavorite(
    @UserProperty('uid') uid: string,
    @Args('deleteNewFromFavoriteData')
    deleteNewFromFavoriteData: AddDeleteFavoriteNewInput,
  ) {
    deleteNewFromFavoriteData.uid = uid;
    return await this.newService.deleteNewFromFavorite(
      deleteNewFromFavoriteData,
    );
  }

  @ResolveField(() => NewFile, { description: "Get news's files" })
  async files(@Parent() { id }: New) {
    return await this.newService.getNewFiles(id);
  }

  @ResolveField(() => Tag, { description: "Get news's tags" })
  async tags(@Parent() { id }: New) {
    return await this.newService.getNewTags(id);
  }

  @ResolveField(() => Boolean, { nullable: true })
  async isFavorite(@Parent() { id }: New, @UserProperty('uid') uid: string) {
    return await this.newService.getIsFavorite({ new_id: id, uid });
  }
}
