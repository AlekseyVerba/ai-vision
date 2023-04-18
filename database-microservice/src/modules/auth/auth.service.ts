import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';

//ENUMS
import { TokenTypesEnum } from 'src/constants/token/token.constant';

//DTO
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmNewPasswordDto } from './dto/confirm-new-password.dto';

//MODELS
import { User } from 'src/models/user.model';
import { UserToken } from 'src/models/user_token.model';
import { UserAvatars } from 'src/models/user_avatars.model';

//SERVICES
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject('MAILER_MICROSERVICE') private clientMailer: ClientProxy,

    @InjectModel(User)
    private userRepository: typeof User,

    @InjectModel(UserToken)
    private userTokenRepository: typeof UserToken,

    @InjectModel(UserAvatars)
    private userAvatarsRepository: typeof UserAvatars,
  ) {}

  async resetPassword(email: string) {
    const user = await this.userService.getUserByEmail(email);

    const { value } = await this.userTokenRepository.create({
      type: TokenTypesEnum.RESET_PASSWORD,
      user_uid: user.uid,
    });

    this.clientMailer.emit('message.reset-password', {
      name: user.name,
      email: user.email,
      token: value,
    });

    return 'A message with token has been sent to your email!';
  }

  async login({ email, password }: LoginDto) {
    let user = await this.userRepository
      .scope({ password })
      .findOne({ where: { email } });

    const isPasswordEqual = await compare(password, user.password);

    if (!isPasswordEqual) throw new RpcException('Password is not corrected');

    if (!user.is_active) {
      throw new RpcException('Your account is not active!')
    }

    const jwt_token = this.createJwtToken(user);

    user = user.toJSON();
    delete user.password;

    return {
      user,
      jwt_token,
    };
  }

  async registration(dto: RegistrationDto) {
    const transaction = await this.userRepository.sequelize.transaction();

    try {
      const newUser = await this.userRepository.create(dto, { transaction });
      this.userAvatarsRepository.create(
        { user_uid: newUser.uid },
        { transaction },
      );

      const { value } = await this.userTokenRepository.create(
        {
          type: TokenTypesEnum.REGISTRATION,
          user_uid: newUser.uid,
        },
        { transaction },
      );

      this.clientMailer.emit('message.registration', {
        name: dto.name,
        email: dto.email,
        token: value,
      });

      await transaction.commit();

      return "A message with token has been sent to your email. It's neccesary to confirmation!";
    } catch (err) {
      console.log(err);
      transaction.rollback();
      throw new RpcException(err.message);
    }
  }

  async confirmRegistrationToken(token: string) {
    const transaction = await this.userRepository.sequelize.transaction();

    try {
      const currentToken = await this.userTokenRepository.findByPk(token);

      if (!currentToken) {
        throw new RpcException('Token does not exist');
      }

      if (!currentToken.is_active) {
        throw new RpcException('Token is not active');
      }

      if (new Date(currentToken.expire) < new Date()) {
        throw new RpcException('Token has already been expired');
      }

      currentToken.update({ is_active: false }, { transaction });

      const user = await (
        await this.userRepository.findOne({
          include: [
            {
              model: UserToken,
              where: {
                value: token,
              },
              required: true,
            },
          ],
        })
      ).update({ is_active: true }, { transaction });

      await transaction.commit();

      this.clientMailer.emit('message.confirm-registration-success', {
        name: user.name,
        email: user.email,
      });

      const jwt_token = this.createJwtToken(user);

      return {
        user,
        jwt_token,
      };
    } catch (err) {
      transaction.rollback();
      throw new RpcException(err.message);
    }
  }

  async confirmNewPassword({ token, password }: ConfirmNewPasswordDto) {
    const transaction = await this.userRepository.sequelize.transaction();

    try {
      const currentToken = await this.userTokenRepository.findByPk(token);

      if (!currentToken) {
        throw new RpcException('Token does not exist');
      }

      if (!currentToken.is_active) {
        throw new RpcException('Token is not active');
      }

      if (new Date(currentToken.expire) < new Date()) {
        throw new RpcException('Token has already been expired');
      }

      currentToken.update({ is_active: false });

      const newHashPassword = await hash(password, 10);

      const user = (
        await this.userRepository.update(
          { password: newHashPassword },
          { where: { uid: currentToken.user_uid }, returning: true },
        )
      )[1][0];

      await transaction.commit();

      this.clientMailer.emit('message.update-password', {
        name: user.name,
        email: user.email,
      });

      return 'Password has been successufully changed!';
    } catch (err) {
      transaction.rollback();
      throw new RpcException(err.message);
    }
  }

  createJwtToken(user: User) {
    return sign(
      {
        uid: user.uid,
        email: user.email,
        name: user.name,
        is_active: user.is_active,
      },
      process.env.JWT_SECRET || '1111',
      {
        expiresIn: '3h',
      },
    );
  }
}
