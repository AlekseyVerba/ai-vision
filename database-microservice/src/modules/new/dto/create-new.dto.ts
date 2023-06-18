export interface CreateNewDTO {
  uid: string;
  title: string;
  shortDescription?: string;
  description: string;
  tags: string[];
  previewPath?: string;
  filesPath?: string[];
  pdfPath?: string
}
