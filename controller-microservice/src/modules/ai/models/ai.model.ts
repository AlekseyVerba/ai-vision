import { Field, Int, ObjectType } from '@nestjs/graphql';

//MODELS
import { Category } from '../../category/models/category.model';
import { AiExample } from './ai-example.model';

@ObjectType()
export class Ai {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description: string | null;

  @Field({ nullable: true })
  logo: string | null;

  @Field((type) => Int!)
  category_id: number;

  @Field((type) => Category!)
  category: Category;

  @Field({ nullable: true })
  site: string | null;

  @Field({ nullable: true })
  twitter: string | null;

  @Field((type) => [AiExample])
  examples: AiExample[];
}
