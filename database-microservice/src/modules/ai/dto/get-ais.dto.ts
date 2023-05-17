export interface GetAisDto {
  limit: number;
  offset: number;
  category_id?: number;
  search?: string;
}
