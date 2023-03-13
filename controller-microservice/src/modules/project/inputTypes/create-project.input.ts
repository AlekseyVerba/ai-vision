import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsCategoryExist } from 'src/validations/categoryExists.validation';
import { IsBadWords } from 'src/validations/checkBadWords.validation';
import { CreateAndUpdateProject } from './create-and-update-project.input';

@InputType()
export class CreateProjectInput extends CreateAndUpdateProject {
  @Field()
  @IsString({ message: "Field '$property' is string" })
  @MinLength(3, { message: "Field '$property' length must be more then 3" })
  @IsBadWords()
  title: string;

  @Field({ nullable: true })
  @IsString({ message: "Field '$property' is string" })
  @IsOptional()
  @IsBadWords()
  description?: string;

  @Field({ nullable: true, description: 'Name ai source' })
  @IsString({ message: "Field '$property' is string" })
  @IsOptional()
  @IsBadWords()
  source?: string;

  @Field(() => Int)
  @IsCategoryExist()
  category_id: number;

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

  @Field(() => Float)
  @IsNumber({}, { message: "Field '$property' is number" })
  price: number;
}
