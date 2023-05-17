import { Controller } from '@nestjs/common';

//SERVICES
import { TokenService } from './token.service';
import { MessagePattern } from '@nestjs/microservices';

//DTO
import { ResendTokenDto } from './dto/resend-token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('resend-token')
  async resendToken(dto: ResendTokenDto) {
    return await this.tokenService.resendToken(dto);
  }
}
