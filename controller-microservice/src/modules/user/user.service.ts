import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { FileUpload } from 'src/types/file/file';
import { Readable, Stream } from 'stream';

//SERVICES
import { FileService } from 'src/modules/file/file.service';

//INPUT TYPES
import { UpdateUserInput } from './inputTypes/update-user.input';
import { UpdateUserPasswordInput } from './inputTypes/update-user-password.input';

//MODELS
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('DB_MICROSERVICE') private client: ClientProxy,
    private readonly fileService: FileService,
  ) {}

  async updateUser({ avatar, cover, ...dto }: UpdateUserInput) {
    if (avatar) {
      const normalAvatar = await avatar;
      const buff = await this.fileService.getBufferFromRead(normalAvatar);

      const userAvatars = await lastValueFrom(
        this.client.send('get-user-avatars', dto.uid),
      );

      if (userAvatars.default) {
        this.fileService.deleteFile(userAvatars.small);
        this.fileService.deleteFile(userAvatars.middle);
        this.fileService.deleteFile(userAvatars.large);
        this.fileService.deleteFile(userAvatars.default);
      }

      const [defaultImage, small, middle, large] = await Promise.all([
        this.fileService.uploadFile({
          file: { buff, filename: normalAvatar.filename },
          dir: `user/${dto.uid}`,
        }),
        this.fileService.createResizedImage(
          { buff, filename: normalAvatar.filename },
          `user/${dto.uid}`,
          70,
          {
            height: 33,
            width: 33,
            options: { fit: 'contain' },
          },
        ),
        this.fileService.createResizedImage(
          { buff, filename: normalAvatar.filename },
          `user/${dto.uid}`,
          70,
          {
            height: 66,
            width: 66,
            options: { fit: 'contain' },
          },
        ),
        this.fileService.createResizedImage(
          { buff, filename: normalAvatar.filename },
          `user/${dto.uid}`,
          70,
          {
            height: 128,
            width: 128,
            options: { fit: 'contain' },
          },
        ),
      ]);

      dto.avatars = {
        defaultImage,
        large,
        middle,
        small,
      };
    }

    if (cover) {
      const normalCover = await cover;
      const buff = await this.fileService.getBufferFromRead(normalCover);

      const user = await this.getUserByUid(dto.uid);

      if (user.cover_path) {
        this.fileService.deleteFile(user.cover_path);
      }

      dto.cover_path = await this.fileService.uploadFile({
        file: { buff, filename: normalCover.filename },
        dir: `user/${dto.uid}`,
      });
    }

    return await lastValueFrom(this.client.send('update-user', dto));
  }

  async updateUserPassword(dto: UpdateUserPasswordInput) {
    return await lastValueFrom(this.client.send('update-user-password', dto));
  }

  async getUserByUid(uid: string) {
    return lastValueFrom(this.client.send('get-user-by-uid', uid));
  }

  async getUserByEmail(email: string) {
    return lastValueFrom(this.client.send<User>('get-user-by-email', email));
  }

  async getUserByName(name: string) {
    return lastValueFrom(this.client.send('get-user-by-name', name));
  }

  async getUserAvatars(uid: string) {
    return lastValueFrom(this.client.send('get-user-avatars', uid));
  }
}
