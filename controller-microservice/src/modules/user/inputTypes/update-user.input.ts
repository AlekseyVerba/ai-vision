import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { FileUpload } from 'src/types/file/file';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UpdateUserInput {
    uid?: string

    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    description?: string

    @Field(() => GraphQLUpload)
    avatar?: Promise<FileUpload>;

    avatars?: {
        defaultImage: string
        small: string
        middle: string
        large: string
    }
}