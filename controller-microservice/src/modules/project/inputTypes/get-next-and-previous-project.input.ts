import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsProjectExist } from 'src/validations/projectExists.validation';

@InputType()
export class GetNextAndPreviousProjectInput {
  @IsEmpty()
  uid?: string;

  @Field((type) => Int)
  @IsProjectExist()
  project_id: number;

  @Field((type) => String, { nullable: true })
  author_uid?: string;

  @Field((type) => Number, { nullable: true })
  category_id?: number;
}
