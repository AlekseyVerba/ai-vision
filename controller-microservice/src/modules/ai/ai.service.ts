import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

//INPUT TYPES
import { CreateAiInput } from './inputTypes/create-ai.input';
import { GetAisInput } from './inputTypes/get-ais.input';

//MODELS
import { Ai } from './models/ai.model';
import { AiExample } from './models/ai-example.model';
import { Category } from '../category/models/category.model';

//SERVICES
import { FileService } from '../file/file.service';

//INTERFACES
import { FileUpload } from 'src/types/file/file';

@Injectable()
export class AiService {
  constructor(
    @Inject('DB_MICROSERVICE') private client: ClientProxy,
    private readonly fileService: FileService,
  ) {}

  async getAis(dto: GetAisInput) {
    return lastValueFrom(this.client.send<Ai[]>('get-ais', dto));
  }

  async getAi(id: string) {
    return lastValueFrom(this.client.send<Ai>('get-ai', id));
  }

  async getAiCategory(id: string) {
    return lastValueFrom(this.client.send<Category>('get-ai-category', id));
  }

  async getAiExamples(id: string) {
    return lastValueFrom(this.client.send<AiExample[]>('get-ai-examples', id));
  }

  async createAi({ examples, logoPath, ...dto }: CreateAiInput): Promise<Ai> {
    if (logoPath) {
      const awaitLogo = await logoPath;
      const buff = await this.fileService.getBufferFromRead(awaitLogo);

      dto.logo = await this.fileService.uploadFile({
        file: { buff, filename: awaitLogo.filename },
        dir: `ai/logos`,
      });
    }

    if (examples && examples.length) {
      dto.examplesPath = await this.uploadAiFiles({ files: examples });
    }

    return lastValueFrom(this.client.send<Ai>('create-ai', dto));
  }

  async uploadAiFiles({ files }: { files: Promise<FileUpload>[] }) {
    return await Promise.all(
      files.map(async (file) => {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        return this.fileService.uploadFileStream({
          file: { stream, filename },
          dir: `ai/examples`,
        });
      }),
    );
  }
}
