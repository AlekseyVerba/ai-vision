import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

//SERVICES
import { AiService } from './ai.service';

//MODELS
import { Ai } from './models/ai.model';
import { AiExample } from './models/ai-example.model';
import { Category } from '../category/models/category.model';

//GUARDS
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator';
import { Roles, RolesEnum } from 'src/decorators/roles.decorator';

//INPUT TYPES
import { CreateAiInput } from './inputTypes/create-ai.input';
import { GetAisInput } from './inputTypes/get-ais.input';
import { GetAiInput } from './inputTypes/get-ai.input';

@Resolver((of) => Ai)
@UsePipes(new ValidationPipe())
@UseGuards(RolesGuard)
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Query((returns) => [Ai!], { description: 'Get ais' })
  async getAis(@Args('aisQueryData') getAisData: GetAisInput) {
    return await this.aiService.getAis(getAisData);
  }

  @Query((returns) => Ai!, { nullable: true, description: 'Get an ai' })
  async getAi(@Args('getProjectData') { id }: GetAiInput) {
    return await this.aiService.getAi(id);
  }

  @Query((returns) => Number, { nullable: false, description: 'Get counter ais' })
  async getCountAis() {
    return await this.aiService.getCountAis();
  }

  @Mutation((returns) => Ai, { description: 'Create ai' })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard)
  async createAi(
    @UserProperty('uid') uid: string,
    @Args('createAiData') createAiData: CreateAiInput,
  ) {
    createAiData.uid = uid;
    return await this.aiService.createAi(createAiData);
  }

  @ResolveField(() => AiExample, { description: "Get ai's examples" })
  async examples(@Parent() { id }: Ai) {
    return await this.aiService.getAiExamples(id);
  }

  @ResolveField(() => Category, { description: "Get ai's category" })
  async category(@Parent() { id }: Ai) {
    return await this.aiService.getAiCategory(id);
  }
}
