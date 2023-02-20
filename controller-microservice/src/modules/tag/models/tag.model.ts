import { Field ,ObjectType } from '@nestjs/graphql';

//MODEL
import { Project } from 'src/modules/project/models/project.model'

@ObjectType()
export class Tag {
    @Field()
    id: number

    @Field()
    name: string

    @Field(type => [Project])
    projects: Project[]
}