import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsUserExistByEmail } from 'src/validations/userExistByEmail.validation';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: "Field '$property' must be email" })
  @IsUserExistByEmail()
  email: string;

  @Field()
  @IsString({ message: "Field '$property' be string" })
  @MinLength(8, { message: "Field '$property' length must be more then 8" })
  @MaxLength(16, { message: "Field '$property' length must be less then 16" })
  password: string;
}
