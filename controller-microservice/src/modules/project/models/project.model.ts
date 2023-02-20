import { Field ,Float,Int,ObjectType } from '@nestjs/graphql';

//MODELS
import { ProjectAvatars } from './project-avatars.model'
import { User } from 'src/modules/user/models/user.model'
import { ProjectFile } from './project-file.model'
import { Tag } from 'src/modules/tag/models/tag.model'
import { Category } from 'src/modules/category/models/category.model'

@ObjectType()
export class Project {
    @Field(type => Int!)
    id: number

    @Field(type => String!)
    title: string

    @Field({ nullable: true })
    description: string

    @Field({ nullable: true })
    source: string

    @Field(type => Float!)
    price: number;

    @Field(type => String!)
    author_uid: string

    @Field(type => Int!)
    category_id: number

    @Field()
    createdAt: string

    @Field()
    updatedAt: string

    @Field(type => Category!)
    category: Category

    @Field(type => User!)
    author: User

    @Field(type => ProjectAvatars!)
    avatars: ProjectAvatars

    @Field(type => [ProjectFile])
    files: ProjectFile[]

    @Field(type => [Tag])
    tags: Tag[]
}