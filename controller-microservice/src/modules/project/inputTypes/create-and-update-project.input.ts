import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { FileUpload } from 'src/types/file/file';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsEmpty } from 'class-validator';

@InputType()
export abstract class CreateAndUpdateProject {
    @IsEmpty()
    uid: string

    @Field(() => GraphQLUpload, { nullable: true, description: 'Project\'s avatar' })
    avatar?: Promise<FileUpload>

    @Field(type => [GraphQLUpload], { nullable: true, description: 'Project\'s files' })
    files?: Promise<FileUpload>[]

    filesPath?: string[]

    avatars?: {
        default: string
        middle: string
    }
}