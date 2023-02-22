export interface CreateUpdateProjectDto {
    uid: string
    filesPath?: string[]
    avatars?: {
        default: string
        middle: string
    }
}