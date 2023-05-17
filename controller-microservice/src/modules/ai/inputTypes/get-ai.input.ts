import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAiInput {
  @Field()
  id: string;
}
