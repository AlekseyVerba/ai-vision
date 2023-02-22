import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsEmpty } from 'class-validator';
import { IsProjectFileExist } from 'src/validations/projectFileExists.validation'

@InputType()
export class DeleteFileInput {
    @IsEmpty()
    uid: string

    @Field(type => Int)
    @IsProjectFileExist()
    id: number

}