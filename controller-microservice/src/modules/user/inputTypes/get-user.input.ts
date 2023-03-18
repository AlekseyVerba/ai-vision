import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetUserInput {
  @IsUUID()
  @Field(() => String)
  uid: string;
}
