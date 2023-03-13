import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ConfirmNewPasswordInput {
  @Field()
  @IsUUID(4, { message: "Field '$property' must be UUID" })
  token: string;

  @Field()
  @IsString({ message: "Field '$property' must be string" })
  @MinLength(8, { message: "Field '$property' length must be more then 8" })
  @MaxLength(16, { message: "Field '$property' length must be less then 16" })
  password: string;
}
