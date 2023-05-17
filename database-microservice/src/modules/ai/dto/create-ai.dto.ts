export interface CreateAiDto {
  uid: string;
  name: string;
  description?: string;
  logo?: string;
  category_id: number;
  site?: string;
  twitter?: string;
  examplesPath?: string[];
}
