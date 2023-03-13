import { Field, ObjectType } from '@nestjs/graphql';

//MODEL
import { Project } from './project.model';

@ObjectType()
export class ProjectAvatars {
  @Field()
  id: number;

  @Field()
  middle: string;

  @Field()
  default: string;

  @Field()
  project_id: number;

  @Field((type) => Project!)
  project: Project;
}
