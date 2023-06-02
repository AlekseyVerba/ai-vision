import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

//FOREIGN
import { New } from './new.model';
import { User } from './user.model';

@Table({ tableName: 'users_news_favorite' })
export class UserNewFavorite extends Model<UserNewFavorite> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_uid: string;

  @ForeignKey(() => New)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  new_id: string;

  @BelongsTo(() => New, { onDelete: 'cascade' })
  new: New;

  @BelongsTo(() => User, { onDelete: 'cascade' })
  user: User;
}
