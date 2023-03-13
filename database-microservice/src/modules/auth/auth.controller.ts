import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { AuthService } from './auth.service';

//DTO
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmNewPasswordDto } from './dto/confirm-new-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('reset-password')
  async resetPassword(email: string) {
    return await this.authService.resetPassword(email);
  }

  @MessagePattern('login')
  async login(dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @MessagePattern('registration-user')
  async registration(dto: RegistrationDto) {
    return await this.authService.registration(dto);
  }

  @MessagePattern('confirm-registration-token')
  async confirmRegistrationToken(token: string) {
    return await this.authService.confirmRegistrationToken(token);
  }

  @MessagePattern('confirm-new-password')
  async confirmNewPassword(dto: ConfirmNewPasswordDto) {
    return await this.authService.confirmNewPassword(dto);
  }
}
