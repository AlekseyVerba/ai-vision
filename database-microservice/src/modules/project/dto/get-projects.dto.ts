export interface GetProjectsDto {
  limit: number;
  offset: number;
  category_id?: number;
  search?: string;
  sort: string;
}
