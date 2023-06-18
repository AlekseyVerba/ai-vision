import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

//FOREIGNERS
import { Tag } from './tag.model';
import { NewTag } from './new_tag.model';
import { NewFile } from './new_file.model';
import { User } from './user.model';
import { UserNewFavorite } from './user_new_favorite.model';

@Table({ tableName: 'new' })
export class New extends Model<New> {
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    field: 'short_description',
    defaultValue: '',
  })
  shortDescription: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: '',
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  preview: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  pdf: string;

  @HasMany(() => NewFile)
  files: NewFile[];

  @BelongsToMany(() => Tag, () => NewTag)
  tags: Tag[];

  @BelongsToMany(() => User, () => UserNewFavorite)
  user_favorited: User[];

  createdAt: any;
  updatedAt: any;
}
