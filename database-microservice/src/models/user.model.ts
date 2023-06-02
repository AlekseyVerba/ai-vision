import {
  Model,
  Table,
  Column,
  DataType,
  HasOne,
  HasMany,
  BelongsToMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';

//FOREIGN
import { UserAvatars } from './user_avatars.model';
import { Project } from './project.model';
import { UserProjectFavorite } from './user_project_favorite.model';
import { UserToken } from './user_token.model';
import { New } from './new.model';
import { UserNewFavorite } from './user_new_favorite.model';

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}

@Table({
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password'] } },
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  })
  uid: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: RolesEnum.USER,
  })
  role: RolesEnum;

  @Column({
    type: DataType.TEXT,
  })
  facebook_link: string;

  @Column({
    type: DataType.TEXT,
  })
  instagram_link: string;

  @Column({
    type: DataType.TEXT,
  })
  twitter_link: string;

  @Column({
    type: DataType.TEXT,
  })
  pinterest_link: string;

  @Column({
    type: DataType.TEXT,
  })
  telegram_link: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.TEXT,
  })
  cover_path: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @HasOne(() => UserAvatars)
  avatars: UserAvatars;

  @HasMany(() => Project)
  projects: Project[];

  @HasMany(() => UserToken)
  tokens: UserToken[];

  @BelongsToMany(() => Project, () => UserProjectFavorite)
  projects_favorite: Project[];

  @BelongsToMany(() => New, () => UserNewFavorite)
  news_favorite: New[];

  @BeforeCreate
  static async hashPassword(instance) {
    const saltRounds = 10;
    instance.password = await hash(instance.password, saltRounds);
  }
}
