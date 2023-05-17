import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

//INPUT TYPES
import { RegistrationInput } from './inputTypes/registration.input';
import { LoginInput } from './inputTypes/login.input';
import { ConfirmNewPasswordInput } from './inputTypes/confirm-new-password.input';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('DB_MICROSERVICE') private client: ClientProxy) {}

  async login(dto: LoginInput) {
    return this.client.send('login', dto);
  }

  async getUser(uid: string) {
    const user = await lastValueFrom(this.client.send('get-user-by-uid', uid));

    if (!user.is_active) {
      throw new RpcException('Your account is not active');
    }

    return user;
  }

  async registration(dto: RegistrationInput) {
    return await lastValueFrom(this.client.send('registration-user', dto));
  }

  async confirmRegistrationToken(token: string) {
    return this.client.send('confirm-registration-token', token);
  }

  async resetPassword(email: string) {
    return await lastValueFrom(this.client.send('reset-password', email));
  }

  async confirmNewPassword(dto: ConfirmNewPasswordInput) {
    return await lastValueFrom(this.client.send('confirm-new-password', dto));
  }
}
