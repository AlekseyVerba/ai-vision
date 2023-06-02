import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

//INTERFACES
import { FileUpload } from 'src/types/file/file';

//SERVICES
import { FileService } from '../file/file.service';

//DTO
import { CreateNewInput } from './inputTypes/create-new.input';
import { AddDeleteFavoriteNewInput } from './inputTypes/add-delete-favorite-new.input';
import { GetNewsInput } from './inputTypes/get-news.input';
import { NewFile } from './models/new_file.model';

//MODELS
import { New } from './models/new.model';
import { Tag } from '../tag/models/tag.model';

//QUERIES
import { Success } from '../auth/queriesTypes/succes.query';

@Injectable()
export class NewService {
  constructor(
    @Inject('DB_MICROSERVICE') private client: ClientProxy,
    private readonly fileService: FileService,
  ) {}

  async getNews(dto: GetNewsInput) {
    return lastValueFrom(this.client.send<New[]>('get-news', dto));
  }

  async createNew({ preview, files, ...dto }: CreateNewInput) {
    if (preview) {
      const awaitPreview = await preview;
      const buff = await this.fileService.getBufferFromRead(awaitPreview);

      dto.previewPath = await this.fileService.uploadFile({
        file: { buff, filename: awaitPreview.filename },
        dir: `news/previews`,
      });
    }

    if (files && files.length) {
      dto.filesPath = await this.uploadAiFiles({ files });
    }

    return lastValueFrom(this.client.send<New>('create-new', dto));
  }

  async uploadAiFiles({ files }: { files: Promise<FileUpload>[] }) {
    return await Promise.all(
      files.map(async (file) => {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        return this.fileService.uploadFileStream({
          file: { stream, filename },
          dir: `news/files`,
        });
      }),
    );
  }

  async deleteNew(id: string): Promise<Success> {
    const oldNew = await lastValueFrom(this.client.send<New>('delete-new', id));

    if (oldNew.preview) {
      this.fileService.deleteFile(oldNew.preview);
    }

    if (oldNew.files && oldNew.files.length) {
      oldNew.files.forEach((file) => {
        this.fileService.deleteFile(file.value);
      });
    }

    return {
      value: 'New has been deleted',
    };
  }

  async getNewById(id: string) {
    return lastValueFrom(this.client.send<New>('get-new', id));
  }

  async addNewToFavorite(dto: AddDeleteFavoriteNewInput) {
    return lastValueFrom(this.client.send<Success>('add-new-to-favorite', dto));
  }

  async deleteNewFromFavorite(dto: AddDeleteFavoriteNewInput) {
    return lastValueFrom(
      this.client.send<Success>('delete-new-from-favorite', dto),
    );
  }

  async getUserFavoriteNews(uid: string) {
    return lastValueFrom(
      this.client.send<New[]>('get-user-favorite-news', uid),
    );
  }

  async getNewFiles(id: string) {
    return lastValueFrom(this.client.send<NewFile[]>('get-new-files', id));
  }

  async getNewTags(id: string) {
    return lastValueFrom(this.client.send<Tag[]>('get-new-tags', id));
  }

  async getIsFavorite(dto: { new_id: string; uid: string }) {
    return lastValueFrom(this.client.send<Tag[]>('get-new-is-favorite', dto));
  }
}
