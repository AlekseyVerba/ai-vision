import { Provider } from '@nestjs/common';
import * as BadWordsFilter from 'bad-words';

export const BAD_WORDS_PROVIDER: Provider = {
  provide: 'BadWords',
  useValue: new BadWordsFilter(),
};
