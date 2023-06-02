import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FileUpload } from 'src/types/file/file';
import { IsBadWords } from 'src/validations/checkBadWords.validation';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class CreateNewInput {
  @IsEmpty()
  uid: string;

  @Field()
  @IsString({ message: "Field '$property' is string" })
  @MinLength(3, { message: "Field '$property' length must be more then 3" })
  @IsBadWords()
  title: string;

  @Field()
  @IsString({ message: "Field '$property' is string" })
  @MinLength(3, { message: "Field '$property' length must be more then 3" })
  @MaxLength(100, {
    message: "Field '$property' length must be less then 100",
  })
  @IsBadWords()
  @IsOptional()
  shortDescription?: string;

  @Field()
  @IsString({ message: "Field '$property' is string" })
  @MinLength(3, { message: "Field '$property' length must be more then 3" })
  @MaxLength(1000, {
    message: "Field '$property' length must be less then 1000",
  })
  @IsBadWords()
  @IsOptional()
  description: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  preview: Promise<FileUpload>;

  @Field(() => [String], {
    description: 'If tag does not exist, it will be created',
  })
  @IsBadWords({ each: true })
  @IsString({ each: true })
  @MinLength(3, { message: 'Every tag length must be more then 3', each: true })
  @MaxLength(15, {
    message: 'Every tag length must be less then 3',
    each: true,
  })
  tags: string[];

  @Field((type) => [GraphQLUpload], {
    nullable: true,
    description: "news's files",
  })
  files: Promise<FileUpload>[];

  previewPath?: string;

  filesPath?: string[];
}
