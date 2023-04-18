import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEmail, IsEmpty, IsEnum } from "class-validator";
import { TokenTypesEnum } from '../../../constants/token.constant'


registerEnumType(TokenTypesEnum, {
    name: 'TokenTypesEnum',
  });

@InputType()
export class ResendTokenInput {
    @IsEnum([TokenTypesEnum.RESET_PASSWORD, TokenTypesEnum.REGISTRATION])
    @Field(() => TokenTypesEnum)
    type: TokenTypesEnum

    @IsEmail()
    @Field(() => String)
    email: string;
}