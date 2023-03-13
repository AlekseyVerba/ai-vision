import { Module } from '@nestjs/common';
import { JSZIP_PROVIDER } from './jszip.provider';

@Module({
  providers: [JSZIP_PROVIDER],
  exports: [JSZIP_PROVIDER],
})
export class JSZipModule {}
