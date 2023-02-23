import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetProjectsInput {

    @Field(type => Int!)
    limit: number

    @Field(type => Int!)
    offset: number

    @Field({ nullable: true })
    category_id?: number

    @Field({ nullable: true })
    search: string

    @Field({ nullable: true, defaultValue: 'date', description: 'There are available sorts: (new, old, random,top)' })
    sort: string
}