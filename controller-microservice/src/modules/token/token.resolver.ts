import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

//SERVICES
import { TokenService } from './token.service';

//GUARDS
import { AuthGuard } from 'src/guards/auth.guard';

//INPUT TYPES
import { Success } from '../auth/queriesTypes/succes.query';
import { ResendTokenInput } from './inputTypes/resend-token.input';

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator';

@Resolver()
@UsePipes(new ValidationPipe())
export class TokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Mutation(() => Success, { description: 'Resend token' })
  async resendToken(@Args('resendTokenData') dto: ResendTokenInput) {
    return await this.tokenService.resendToken(dto);
  }
}
