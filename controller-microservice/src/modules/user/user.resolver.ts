import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

//INPUT TYPES
import { UpdateUserInput } from './inputTypes/update-user.input';
import { UpdateUserPasswordInput } from './inputTypes/update-user-password.input';
import { GetUserInput } from './inputTypes/get-user.input';

//GUARDS
import { AuthGuard } from 'src/guards/auth.guard';

//MODELS
import { User } from './models/user.model';
import { UserAvatars } from './models/user-avatars.model';

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator';

//PIPES
import { ValidationPipe } from 'src/pipes/validation.pipe';

//QUERIES DATA
import { Success } from '../auth/queriesTypes/succes.query';

@Resolver((of) => User)
@UsePipes(new ValidationPipe())
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User, { nullable: true })
  async getUser(@Args('getUserData') { uid }: GetUserInput) {
    return await this.userService.getUserByUid(uid);
  }

  @Mutation((returns) => User, { description: 'Update current user' })
  @UseGuards(AuthGuard)
  async updateUser(
    @UserProperty('uid') uid: string,
    @Args('updateUserData') updateUserData: UpdateUserInput,
  ) {
    updateUserData.uid = uid;
    return await this.userService.updateUser(updateUserData);
  }

  @Mutation((returns) => Success, { description: 'Update user password' })
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @UserProperty('uid') uid: string,
    @Args('updateUserPasswordData') dto: UpdateUserPasswordInput,
  ) {
    dto.uid = uid;
    return await this.userService.updateUserPassword(dto);
  }

  @ResolveField(() => UserAvatars, { description: 'Get users avatars' })
  async avatars(@Parent() { uid }: User) {
    return await this.userService.getUserAvatars(uid);
  }
}
