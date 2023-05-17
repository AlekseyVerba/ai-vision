import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
