import { Field ,ObjectType } from '@nestjs/graphql';

//MODELS
import { Project } from 'src/modules/project/models/project.model'
import { UserAvatars } from './user-avatars.model'

@ObjectType()
export class User {
    @Field()
    uid: string

    @Field()
    email: string

    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    description: string

    @Field()
    is_active: boolean

    @Field(type => UserAvatars)
    avatars: UserAvatars

    @Field(type => [Project!])
    projects: Project[]
}