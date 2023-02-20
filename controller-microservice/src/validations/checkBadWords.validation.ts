import { Inject, Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import * as BadWordsFilter from 'bad-words'

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBadWordsConstraint implements ValidatorConstraintInterface {
    constructor(
        @Inject('BadWords')
        private readonly badWords: BadWordsFilter,
    ) {}

    async validate(text: string, args: ValidationArguments) {
        return !this.badWords.isProfane(text)
    }

    defaultMessage(args: ValidationArguments) {
        return `Field '${args.property}' contains profane language` ;
    }
}

export function IsBadWords(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBadWordsConstraint,
        });
    };
}