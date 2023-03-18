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
export class IsUserExistByUidConstraint
  implements ValidatorConstraintInterface
{
  constructor(@Inject(UserService) private userService: UserService) {}

  async validate(uid: string, args: ValidationArguments) {
    return !!(await this.userService.getUserByUid(uid));
  }

  defaultMessage(args: ValidationArguments) {
    return `User with uid '${args.value}' doesn\'t exist`;
  }
}

export function IsUserExistByUid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExistByUidConstraint,
    });
  };
}
