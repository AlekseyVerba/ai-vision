import { Stream } from "stream";

export interface UpdateUserDto {
    uid: string;
    name?: string;
    description?: string;
    avatars?: {
        defaultImage: string
        small: string
        middle: string
        large: string
    }
}