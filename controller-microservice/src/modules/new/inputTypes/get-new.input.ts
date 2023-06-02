import { Field, InputType } from '@nestjs/graphql';
import { IsNewExist } from 'src/validations/newExists.validation';

@InputType()
export class GetNewInput {
  @Field()
  @IsNewExist()
  id: string;
}
