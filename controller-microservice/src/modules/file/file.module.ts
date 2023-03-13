import { Module } from '@nestjs/common';

//SERVICES
import { FileService } from './file.service';

//MODULES
import { JSZipModule } from 'src/modules/jszip/jszip.module';

@Module({
  imports: [JSZipModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
