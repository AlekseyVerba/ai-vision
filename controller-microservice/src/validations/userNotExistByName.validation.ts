import { Inject, Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserNotExistByNameConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(UserService) private userService: UserService) { }

    async validate(name: string, args: ValidationArguments) {
        return !(await this.userService.getUserByName(name))
    }

    defaultMessage(args: ValidationArguments) {
        return `User with name '${args.value}' already exists`;
    }
}

export function IsUserNotExistByName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserNotExistByNameConstraint,
        });
    };
}