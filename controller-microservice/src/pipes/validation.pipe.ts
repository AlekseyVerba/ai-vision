import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GraphQLError } from 'graphql';
import { UserInputError } from "apollo-server-express"

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {

            const errorsObj = errors.reduce((previousValue, currentValue) => {
                previousValue[currentValue.property] = Object.values(currentValue.constraints)
                return previousValue
            }, {})

            throw new GraphQLError(
                'Validation failed',
                {
                    extensions:errorsObj
                }
            )
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}