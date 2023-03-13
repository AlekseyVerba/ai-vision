import { Injectable } from '@nestjs/common';

//MODELS
import { User } from 'src/models/user.model';
import { UserAvatars } from 'src/models/user_avatars.model';

//SEQUELIZE
import { InjectModel } from '@nestjs/sequelize';

//DTOS
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,

    @InjectModel(UserAvatars)
    private userAvatarsRepository: typeof UserAvatars,
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

  async getUserByUid(uid: string) {
    return this.userRepository.findByPk(uid);
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
