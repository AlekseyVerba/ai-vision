import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CategoryService } from 'src/modules/category/category.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsCategoryExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(CategoryService) private categoryService: CategoryService,
  ) {}

  async validate(id: number, args: ValidationArguments) {
    return !!(await this.categoryService.getCategoryById(id));
  }

  defaultMessage(args: ValidationArguments) {
    return `Category with id '${args.value}' doesn\'t exist`;
  }
}

export function IsCategoryExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCategoryExistsConstraint,
    });
  };
}
