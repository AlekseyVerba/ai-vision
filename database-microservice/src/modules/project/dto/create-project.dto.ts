import { CreateUpdateProjectDto } from './create-and-update-project.dto';

export interface CreateProjectDto extends CreateUpdateProjectDto {
  title: string;
  category_id: number;
  price: number;
  description?: string;
  source?: string;
  tags: string[];
}
