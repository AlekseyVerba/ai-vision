import { InputType, Field } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsNewExist } from '../../../validations/newExists.validation';

@InputType()
export class AddDeleteFavoriteNewInput {
  @IsEmpty()
  uid: string;

  @Field()
  @IsNewExist()
  id: string;
}
