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
export class IsUserNotExistByEmailConstraint
  implements ValidatorConstraintInterface
{
  constructor(@Inject(UserService) private userService: UserService) {}

  async validate(email: string, args: ValidationArguments) {
    return !(await this.userService.getUserByEmail(email));
  }

  defaultMessage(args: ValidationArguments) {
    return `User with email '${args.value}' already exists`;
  }
}

export function IsUserNotExistByEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNotExistByEmailConstraint,
    });
  };
}
