import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { FileUpload } from 'src/types/file/file';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UpdateUserInput {
  uid?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  facebook_link?: string;

  @Field({ nullable: true })
  instagram_link?: string;

  @Field({ nullable: true })
  twitter_link?: string;

  @Field({ nullable: true })
  pinterest_link?: string;

  @Field({ nullable: true })
  telegram_link?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  cover?: Promise<FileUpload>;

  cover_path?: string;

  @Field(() => GraphQLUpload)
  avatar?: Promise<FileUpload>;

  avatars?: {
    defaultImage: string;
    small: string;
    middle: string;
    large: string;
  };
}
