import { Injectable } from '@nestjs/common';

//MODULES
import { MailerService } from '@nestjs-modules/mailer';

//DTO
import { UserWithTokenDto } from './dto/user-with-token.dto';
import { UserWithNameEmail } from './dto/user-name-email.dto';

//TEMPLATES
import { registrationTemplate } from './templates/registration.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { confirmRegistrationSuccessTemplate } from './templates/confirm-registration-success.template';

@Injectable()
export class AuthService {
  constructor(private mailerService: MailerService) {}

  registration({ email, ...dto }: UserWithTokenDto) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Registration on Ai-vision',
      html: registrationTemplate(dto),
    });
  }

  resetPassword({ email, ...dto }: UserWithTokenDto) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Reset password on Ai-vision',
      html: resetPasswordTemplate(dto),
    });
  }

  confirmRegistrationSuccess({ email, name }: UserWithNameEmail) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Confirm registration success',
      html: confirmRegistrationSuccessTemplate({ name }),
    });
  }
}
