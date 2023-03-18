import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

//SERVICES
import { AuthService } from './auth.service';

//DTO
import { UserWithTokenDto } from './dto/user-with-token.dto';
import { UserWithNameEmail } from './dto/user-name-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('message.registration')
  registration(dto: UserWithTokenDto) {
    this.authService.registration(dto);
  }

  @EventPattern('message.reset-password')
  resetPassword(dto: UserWithTokenDto) {
    this.authService.resetPassword(dto);
  }

  @EventPattern('message.confirm-registration-success')
  confirmRegistrationSuccess(dto: UserWithNameEmail) {
    this.authService.confirmRegistrationSuccess(dto);
  }
}
