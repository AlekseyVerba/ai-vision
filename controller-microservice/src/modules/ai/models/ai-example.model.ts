import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FILE_TYPE } from 'src/constants/file/file.constant';
import { Ai } from './ai.model';

@ObjectType()
export class AiExample {
  @Field()
  id: number;

  @Field()
  type: FILE_TYPE;

  @Field()
  value: string;

  @Field()
  ai_id: number;

  @Field((type) => Ai!)
  ai: Ai;
}
