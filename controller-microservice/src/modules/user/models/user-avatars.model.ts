import { Field, ObjectType } from '@nestjs/graphql';

//MODEL
import { User } from './user.model';

@ObjectType()
export class UserAvatars {
  @Field()
  id: number;

  @Field({ nullable: true })
  small: string;

  @Field({ nullable: true })
  middle: string;

  @Field({ nullable: true })
  large: string;

  @Field({ nullable: true })
  default: string;

  @Field()
  user_uid: string;

  @Field((type) => User!)
  user: User;
}
