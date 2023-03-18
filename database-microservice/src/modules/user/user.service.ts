import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { hash } from 'bcrypt';

//MODELS
import { User } from 'src/models/user.model';
import { UserAvatars } from 'src/models/user_avatars.model';

//SEQUELIZE
import { InjectModel } from '@nestjs/sequelize';

//DTOS
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,

    @InjectModel(UserAvatars)
    private userAvatarsRepository: typeof UserAvatars,

    @Inject('MAILER_MICROSERVICE') private clientMailer: ClientProxy,
  ) {}

  async getUserAvatars(uid: string) {
    return await this.userAvatarsRepository.findOne({
      where: {
        user_uid: uid,
      },
    });
  }

  async updateUser({ avatars, ...dto }: UpdateUserDto) {
    if (avatars) {
      await this.userAvatarsRepository.update(
        { ...avatars, default: avatars.defaultImage },
        { where: { user_uid: dto.uid } },
      );
    }

    return (
      await this.userRepository.update(dto, {
        where: { uid: dto.uid },
        returning: true,
      })
    )[1][0];
  }

  async updateUserPassword({ uid, password }: UpdateUserPasswordDto) {
    const user = await this.userRepository.findByPk(uid);

    const saltRounds = 10;
    password = await hash(password, saltRounds);

    await user.update({ password });

    this.clientMailer.emit('message.update-password', {
      name: user.name,
      email: user.email,
    });

    return { value: 'Successful' };
  }

  async getUserByUid(uid: string) {
    const res = await this.userRepository.findOne({ where: { uid } });
    console.log(res);
    return res;
  }

  async getUserByName(name: string) {
    return this.userRepository.findOne({
      where: { name },
    });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
