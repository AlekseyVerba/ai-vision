import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { NewService } from '../modules/new/new.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsNewExistsConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(NewService) private newService: NewService) {}

  async validate(id: string, args: ValidationArguments) {
    return !!(await this.newService.getNewById(id));
  }

  defaultMessage(args: ValidationArguments) {
    return `New with id '${args.value}' doesn\'t exist`;
  }
}

export function IsNewExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNewExistsConstraint,
    });
  };
}
