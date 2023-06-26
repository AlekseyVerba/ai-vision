import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { IsBadWords } from 'src/validations/checkBadWords.validation';
import { FileUpload } from 'src/types/file/file';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsCategoryExist } from 'src/validations/categoryExists.validation';

@InputType()
export class CreateAiInput {
  @IsEmpty()
  uid: string;

  @Field()
  @IsString({ message: "Field '$property' is string" })
  @MinLength(3, { message: "Field '$property' length must be more then 3" })
  @IsBadWords()
  name: string;

  @Field({ nullable: true })
  @IsString({ message: "Field '$property' is string" })
  @IsOptional()
  @IsBadWords()
  title?: string

  @Field({ nullable: true })
  @IsString({ message: "Field '$property' is string" })
  @IsOptional()
  @IsBadWords()
  description?: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
    description: "Ai's logo",
  })
  logoPath?: Promise<FileUpload>;

  @Field(() => Int)
  @IsCategoryExist()
  category_id: number;

  @Field({ nullable: true })
  @IsUrl({}, { message: "Field '$property' is url" })
  @IsOptional()
  site?: string;

  @Field({ nullable: true })
  @IsUrl({}, { message: "Field '$property' is url" })
  @IsOptional()
  twitter?: string;

  @Field((type) => [GraphQLUpload], {
    nullable: true,
    description: "Ai's examples",
  })
  examples?: Promise<FileUpload>[];

  logo?: string;
  examplesPath?: string[];
}
