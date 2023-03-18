import { Field, InputType } from '@nestjs/graphql';
import { GetProjectsInput } from './get-projects.input';
import { IsUserExistByUid } from 'src/validations/userExistByUid.validation';
import { IsUUID } from 'class-validator';

@InputType()
export class GetUserProjectByUid extends GetProjectsInput {
  @IsUUID()
  @IsUserExistByUid()
  @Field()
  uid: string;
}
