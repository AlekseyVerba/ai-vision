import { Field, Int, ObjectType } from '@nestjs/graphql';

//MODELS

@ObjectType()
export class ProjectPrivateFile {
  @Field((type) => Int!)
  id: number;

  @Field((type) => String!)
  value: string;

  @Field((type) => Int!)
  project_id: number;
}
