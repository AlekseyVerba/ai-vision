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

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant';

//FOREIGN
import { New } from './new.model';

@Table({ tableName: 'new_file' })
export class NewFile extends Model<NewFile> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  type: FILE_TYPE;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  value: string;

  @ForeignKey(() => New)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  new_id: string;

  @BelongsTo(() => New, { onDelete: 'cascade' })
  new: New;
}

