import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

//FOREIGNERS
import { Tag } from './tag.model';
import { New } from './new.model';

@Table({ tableName: 'new_tag' })
export class NewTag extends Model<New> {
  @ForeignKey(() => New)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  new_id: string;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tag_id: number;

  @BelongsTo(() => New, { onDelete: 'cascade' })
  new: New;

  @BelongsTo(() => Tag, { onDelete: 'cascade' })
  tag: Tag;
}
