import { Field, ObjectType } from "@nestjs/graphql";
import { Project } from "./project.model";

@ObjectType()
export class ProjectOne extends Project {
    @Field({ nullable: true })
    isFavorite: boolean;
}