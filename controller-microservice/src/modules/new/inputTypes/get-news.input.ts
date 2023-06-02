import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class GetNewsInput {
  @IsNumber()
  @Field((type) => Int!)
  limit: number;

  @IsNumber()
  @Field((type) => Int!)
  offset: number;

  @Field({ nullable: true })
  search?: string;
}
