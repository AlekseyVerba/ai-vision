import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsProjectExist } from 'src/validations/projectExists.validation';

@InputType()
export class AddDeleteFavoriteProjectInput {
  @IsEmpty()
  uid: string;

  @Field((type) => Int)
  @IsProjectExist()
  id: number;
}
