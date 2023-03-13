import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { IsUserExistByEmail } from 'src/validations/userExistByEmail.validation';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail({}, { message: "Field '$property' must be email" })
  @IsUserExistByEmail()
  email: string;
}
