import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  HasOne,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

//FOREIGN
import { User } from './user.model';

@Table({ tableName: 'user_avatars' })
export class UserAvatars extends Model<UserAvatars> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  small: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  middle: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  large: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  default: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_uid: string;

  @BelongsTo(() => User, { onDelete: 'cascade' })
  user: User;
}
