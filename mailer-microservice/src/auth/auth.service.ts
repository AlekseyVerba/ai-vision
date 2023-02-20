import { Injectable } from "@nestjs/common";

//MODULES
import { MailerService } from '@nestjs-modules/mailer';

//DTO
import { UserWithTokenDto } from './dto/user-with-token.dto'

//TEMPLATES
import { registrationTemplate } from './templates/registration.template'
import { resetPasswordTemplate } from './templates/reset-password.template'

@Injectable()
export class AuthService {
    constructor(private mailerService: MailerService) {}

    registration({ email, ...dto }: UserWithTokenDto) {
        this.mailerService.sendMail({
            to: email,
            subject: 'Registration on Ai-vision',
            html: registrationTemplate(dto)
        })
    }

    resetPassword({ email, ...dto }: UserWithTokenDto) {
        this.mailerService.sendMail({
            to: email,
            subject: 'Reset password on Ai-vision',
            html: resetPasswordTemplate(dto)
        })
    }
}