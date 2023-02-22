import { CreateUpdateProjectDto } from './create-and-update-project.dto'

export interface UpdateProjectDto extends CreateUpdateProjectDto {
    id: number
    title?: string
    description?: string
    source?: string
    category_id?: number;
    tags?: string[]
    price?: number
}