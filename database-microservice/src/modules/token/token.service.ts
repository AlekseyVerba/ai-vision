import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';

//DTO
import { ResendTokenDto } from './dto/resend-token.dto';

//MODELS
import { UserToken } from '../../models/user_token.model';

//CONSTANTS
import { TokenTypesEnum } from '../../constants/token/token.constant';

//MODEL
import { User } from 'src/models/user.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(UserToken)
    private userTokenRepository: typeof UserToken,

    @Inject('MAILER_MICROSERVICE') private clientMailer: ClientProxy,
  ) {}

  async resendToken({ type, email }: ResendTokenDto) {
    const token = await this.userTokenRepository.findOne({
      where: {
        type,
      },
      include: [
        {
          model: User,
          where: {
            email,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!token) {
      throw new RpcException('Token does not exist');
    }

    if (!token.is_active) {
      throw new RpcException('Token has been already confirmed');
    }

    if (new Date(token.expire) < new Date()) {
      throw new RpcException('Token has already been expired');
    }

    const endpoint = this.getEndpointByTypeToken(token.type);

    this.clientMailer.emit(endpoint, {
      name: token.user.name,
      email: token.user.email,
      token: token.value,
    });

    return { value: 'Token resent' };
  }

  getEndpointByTypeToken(type: TokenTypesEnum) {
    switch (type) {
      case TokenTypesEnum.REGISTRATION: {
        return 'message.registration';
      }
      case TokenTypesEnum.RESET_PASSWORD: {
        return 'message.reset-password';
      }
    }
  }
}
