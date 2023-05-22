import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

//INPUT TYPES
import { CreateProjectInput } from './inputTypes/create-project.input';
import { GetProjectsInput } from './inputTypes/get-projects.input';
import { DeleteFileInput } from './inputTypes/delete-file.input';
import { AddDeleteFavoriteProjectInput } from './inputTypes/add-delete-favorite-project.input';
import { DeleteProjectInput } from './inputTypes/delete-project.input';
import { UpdateProjectInput } from './inputTypes/update-project.input';
import { GetProjectInput } from './inputTypes/get-project.input';
import { GetNextAndPreviousProjectInput } from './inputTypes/get-next-and-previous-project.input';
import { GetUserProjectByUid } from './inputTypes/get-user-projects-by-uid.input';
import { IsFavoriteInput } from './inputTypes/is-favorite.input';

//SERVICES
import { FileService } from '../file/file.service';
import { lastValueFrom } from 'rxjs';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'src/types/file/file';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('DB_MICROSERVICE') private client: ClientProxy,
    private readonly fileService: FileService,
  ) {}

  async getProjects(dto: GetProjectsInput) {
    return lastValueFrom(this.client.send('get-projects', dto));
  }

  async getUserProjects(dto: GetUserProjectByUid) {
    return lastValueFrom(this.client.send('get-user-projects', dto));
  }

  async getUserFavoriteProjects(dto: GetUserProjectByUid) {
    return lastValueFrom(this.client.send('get-user-favorite-projects', dto));
  }

  async getProjectPrivateFile(dto: GetProjectInput) {
    return lastValueFrom(this.client.send('get-project-private-file', dto));
  }

  async createProject({
    files,
    avatar,
    private_files,
    ...dto
  }: CreateProjectInput) {
    if (private_files) {
      dto.privateFilePath = await this.uploadPrivateFilesToZip({
        files: private_files,
        uid: dto.uid,
      });
    }

    if (files) {
      dto.filesPath = await this.uploadProjectFiles({ files, uid: dto.uid });
    }

    if (avatar) {
      const { defaultImage, middle } = await this.uploadProjectAvatars({
        avatar,
        uid: dto.uid,
      });

      dto.avatars = {
        default: defaultImage,
        middle,
      };
    }

    return await lastValueFrom(this.client.send('create-project', dto));
  }

  async updateProject({ files, avatar, ...dto }: UpdateProjectInput) {
    const isUserAuthor = lastValueFrom(
      this.client.send('check-user-author-project', {
        uid: dto.uid,
        id: dto.id,
      }),
    );

    if (!isUserAuthor) {
      throw new GraphQLError(
        "You can't update this project! You are not an author of this project.",
      );
    }

    if (avatar) {
      const oldAvatars = await this.getProjectAvatars(dto.id);

      if (oldAvatars.middle) {
        this.fileService.deleteFile(oldAvatars.middle);
      }

      if (oldAvatars.default) {
        this.fileService.deleteFile(oldAvatars.default);
      }

      const { defaultImage, middle } = await this.uploadProjectAvatars({
        avatar,
        uid: dto.uid,
      });

      dto.avatars = {
        default: defaultImage,
        middle,
      };
    }

    if (files) {
      dto.filesPath = await this.uploadProjectFiles({ files, uid: dto.uid });
    }

    return await lastValueFrom(this.client.send('update-project', dto));
  }

  async deleteProject(dto: DeleteProjectInput) {
    const project = await lastValueFrom(
      this.client.send('delete-project', dto),
    );

    if (project.files && project.files.length) {
      project.files.forEach((file) => {
        this.fileService.deleteFile(file.value);
      });
    }

    if (project.avatars.middle) {
      this.fileService.deleteFile(project.avatars.middle);
    }

    if (project.avatars.default) {
      this.fileService.deleteFile(project.avatars.default);
    }

    return true;
  }

  async getProjectAvatars(id: number) {
    return lastValueFrom(this.client.send('get-project-avatars', id));
  }

  async addToFavorite(dto: AddDeleteFavoriteProjectInput) {
    return lastValueFrom(this.client.send('add-to-favorite', dto));
  }

  async deleteFromFavorite(dto: AddDeleteFavoriteProjectInput) {
    return lastValueFrom(this.client.send('delete-from-favorite', dto));
  }

  async deleteFileProject(dto: DeleteFileInput) {
    const filePath = await lastValueFrom(
      this.client.send('delete-file-project', dto),
    );

    if (filePath) {
      this.fileService.deleteFile(filePath);
    }

    return true;
  }

  async getProjectById(dto: GetProjectInput) {
    return lastValueFrom(this.client.send('get-project-by-id', dto));
  }

  async getNextProjectById(dto: GetNextAndPreviousProjectInput) {
    return lastValueFrom(this.client.send('get-next-project-by-id', dto));
  }

  async getPreviousProjectById(dto: GetNextAndPreviousProjectInput) {
    return lastValueFrom(this.client.send('get-previous-project-by-id', dto));
  }

  async getProjectFile(id: number) {
    return lastValueFrom(this.client.send('get-project-file', id));
  }

  async getProjectFiles(id: number) {
    return lastValueFrom(this.client.send('get-project-files', id));
  }

  async getProjectAuthor(id: number) {
    return lastValueFrom(this.client.send('get-project-author', id));
  }

  async getProjectTags(id: number) {
    return lastValueFrom(this.client.send('get-project-tags', id));
  }

  async getProjectCategory(id: number) {
    return lastValueFrom(this.client.send('get-project-category', id));
  }

  async uploadProjectAvatars({
    avatar,
    uid,
  }: {
    avatar: Promise<FileUpload>;
    uid: string;
  }) {
    const normalAvatar = await avatar;
    const buff = await this.fileService.getBufferFromRead(normalAvatar);

    const [defaultImage, middle] = await Promise.all([
      this.fileService.uploadFile({
        file: { buff, filename: normalAvatar.filename },
        dir: `user/${uid}/projects`,
      }),
      this.fileService.createResizedImage(
        { buff, filename: normalAvatar.filename },
        `user/${uid}/projects`,
        70,
        {
          height: 260,
          width: 230,
          options: {
            fit: 'contain',
          },
        },
      ),
    ]);

    return {
      defaultImage,
      middle,
    };
  }

  async uploadProjectFiles({
    files,
    uid,
  }: {
    files: Promise<FileUpload>[];
    uid: string;
  }) {
    return await Promise.all(
      files.map(async (file) => {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        return this.fileService.uploadFileStream({
          file: { stream, filename },
          dir: `user/${uid}/projects`,
        });
      }),
    );
  }

  async uploadPrivateFilesToZip({
    files,
    uid,
  }: {
    files: Promise<FileUpload>[];
    uid: string;
  }) {
    return this.fileService.createZIPWithFiles({ files, uid });
  }

  async getIsFavorite(dto: IsFavoriteInput) {
    return lastValueFrom(this.client.send('get-is-favorite', dto));
  }
}
