import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

//DTO
import { UpdatePasswordDto } from './dto/update-password.dto';

//TEMPLATES
import { updatePasswordTemplate } from './templates/update-password.template';

@Injectable()
export class UserService {
  constructor(private mailerService: MailerService) {}

  async updatePassword({ name, email }: UpdatePasswordDto) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Change password on Ai-vision',
      html: updatePasswordTemplate(name),
    });
  }
}
