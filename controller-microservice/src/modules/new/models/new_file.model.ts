import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FILE_TYPE } from 'src/constants/file/file.constant';

//MODELS
import { New } from './new.model';

type NewFilePosition = 'top' | 'bottom';

@ObjectType()
export class NewFile {
  @Field((type) => Int!)
  id: number;

  @Field()
  type: FILE_TYPE;

  @Field()
  value: string;

  @Field()
  new_id: string;

  @Field((type) => New!)
  new: New;
}
