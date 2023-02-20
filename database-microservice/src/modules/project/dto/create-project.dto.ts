export class CreateProjectDto {
    uid: string
    title: string
    category_id: number
    price: number
    description?: string
    source?: string
    tags: string[]
    avatars?: {
        default: string
        middle: string
    }
    filesPath?: string[]
}