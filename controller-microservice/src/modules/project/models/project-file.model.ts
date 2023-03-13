import { Field, ObjectType } from '@nestjs/graphql';

//MODEL
import { Project } from './project.model';

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant';

@ObjectType()
export class ProjectFile {
  @Field()
  id: number;

  @Field()
  type: FILE_TYPE;

  @Field()
  value: string;

  @Field()
  project_id: number;

  @Field((type) => Project!)
  project: Project;
}
