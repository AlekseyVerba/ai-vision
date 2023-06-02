import { Field, Int, ObjectType } from '@nestjs/graphql';

//MODELS
import { New } from './new.model';
import { Tag } from '../../tag/models/tag.model';

@ObjectType()
export class NewTag {
  @Field()
  new_id: string;

  @Field((type) => Int!)
  tag_id: number;

  @Field((type) => New!)
  new: New;

  @Field((type) => Tag!)
  tag: Tag;
}
