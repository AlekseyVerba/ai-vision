import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards, UsePipes } from '@nestjs/common'
import { UserService } from './user.service' 

//INPUT TYPES
import { UpdateUserInput } from './inputTypes/update-user.input'

//GUARDS
import { AuthGuard } from 'src/guards/auth.guard'

//MODELS
import { User } from './models/user.model'
import { UserAvatars } from './models/user-avatars.model'

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator'

//PIPES
import { ValidationPipe } from 'src/pipes/validation.pipe'


@Resolver(of => User)
@UsePipes(new ValidationPipe())
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => User, { description: 'Update current user' })
  @UseGuards(AuthGuard)
  async updateUser(
    @UserProperty('uid') uid: string,
    @Args('updateUserData') updateUserData: UpdateUserInput
  ) {
    updateUserData.uid = uid
    return await this.userService.updateUser(updateUserData)
  }

  @ResolveField(() => UserAvatars, { description: 'Get user\s avatars' })
  async avatars(@Parent() { uid }: User) {
    return await this.userService.getUserAvatars(uid)
  }
}