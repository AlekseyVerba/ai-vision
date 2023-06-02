import { Field, InputType } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsNewExist } from '../../../validations/newExists.validation';

@InputType()
export class DeleteNewInput {
  @Field()
  @IsNewExist()
  id: string;
}
