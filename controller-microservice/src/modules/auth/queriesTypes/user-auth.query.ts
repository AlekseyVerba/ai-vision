import { Field ,ObjectType } from '@nestjs/graphql';

//MODELS
import { User } from 'src/modules/user/models/user.model'

@ObjectType()
export class UserAuth {
    @Field(type => User)
    user: User

    @Field()
    jwt_token: string
}