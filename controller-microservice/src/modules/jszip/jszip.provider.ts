import { Provider } from '@nestjs/common';
import * as JSZip from 'jszip'

export const JSZIP_PROVIDER: Provider = {
  provide: 'JSZIP',
  useValue: new JSZip(),
};