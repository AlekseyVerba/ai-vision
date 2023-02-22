import { Inject, Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ProjectService } from 'src/modules/project/project.service'

@Injectable()
@ValidatorConstraint({ async: true })
export class IsProjectFileExistsConstraint implements ValidatorConstraintInterface {
    constructor(@Inject(ProjectService) private projectService: ProjectService) { }

    async validate(id: number, args: ValidationArguments) {
        return !!(await this.projectService.getProjectFile(id))
    }

    defaultMessage(args: ValidationArguments) {
        return `File with id '${args.value}' doesn\'t exist`;
    }
}

export function IsProjectFileExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsProjectFileExistsConstraint,
        });
    };
}