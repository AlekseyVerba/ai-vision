import { Field, ObjectType } from '@nestjs/graphql';

//MODELS
import { New } from './new.model';
import { User } from '../../user/models/user.model';

@ObjectType()
export class UserNewFavorite {
  @Field()
  user_uid: string;

  @Field()
  new_id: string;

  @Field((type) => New)
  new: New;

  @Field((type) => User)
  user: User;
}
