import { Module } from "@nestjs/common";
import { BAD_WORDS_PROVIDER } from './bad-words.provider'

import { IsBadWordsConstraint } from 'src/validations/checkBadWords.validation'

@Module({
    providers: [
        BAD_WORDS_PROVIDER,
        IsBadWordsConstraint
    ],
    exports: [BAD_WORDS_PROVIDER]
})
export class BadWordsModule {}