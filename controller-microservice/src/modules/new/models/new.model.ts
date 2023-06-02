import { Field, ObjectType } from '@nestjs/graphql';

//MODELS
import { NewFile } from './new_file.model';
import { Tag } from '../../tag/models/tag.model';

@ObjectType()
export class New {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  shortDescription: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  preview: string;

  @Field((type) => [NewFile]!)
  files: NewFile[];

  @Field((type) => [Tag]!)
  tags: Tag[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  isFavorite: boolean;
}
