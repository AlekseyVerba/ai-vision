import { GetProjectsDto } from './get-projects.dto';

export interface GetUserProjectByUid extends GetProjectsDto {
  uid?: string;
  favorite?: boolean;
}
