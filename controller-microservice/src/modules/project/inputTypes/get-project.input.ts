import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsProjectExist } from 'src/validations/projectExists.validation';

@InputType()
export class GetProjectInput {
  // @IsEmpty()
  uid?: string;

  @Field((type) => Int)
  @IsProjectExist()
  project_id: number;
}
