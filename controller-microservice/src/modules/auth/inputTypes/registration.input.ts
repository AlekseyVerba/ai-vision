import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsUserNotExistByEmail } from 'src/validations/userNotExistByEmail.validation';
import { IsUserNotExistByName } from 'src/validations/userNotExistByName.validation';
import { IsBadWords } from 'src/validations/checkBadWords.validation'

@InputType({ description: 'Registration user' })
export class RegistrationInput {
    @Field()
    @IsString({ message: 'Field \'$property\' be string' })
    @IsUserNotExistByName()
    @IsBadWords()
    name: string

    @Field()
    @IsEmail({}, { message: 'Field \'$property\' must be email' })
    @IsUserNotExistByEmail()
    email: string

    @Field()
    @IsString({ message: 'Field \'$property\' be string' })
    @MinLength(8, { message: 'Field \'$property\' length must be more then 8' })
    @MaxLength(16, { message: 'Field \'$property\' length must be less then 16' })
    password: string
}