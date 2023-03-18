import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FileUpload } from 'src/types/file/file';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UpdateUserPasswordInput {
  @IsEmpty()
  uid: string;

  @Field()
  @IsString({ message: "Field '$property' be string" })
  @MinLength(8, { message: "Field '$property' length must be more then 8" })
  @MaxLength(16, { message: "Field '$property' length must be less then 16" })
  password: string;
}
