import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant';

//FOREIGN
import { Ai } from './ai.model';

@Table({ tableName: 'ai_example' })
export class AiExample extends Model<AiExample> {
  @Column({
    type: DataType.INTEGER,
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

  @ForeignKey(() => Ai)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ai_id: string;

  @BelongsTo(() => Ai, { onDelete: 'cascade' })
  ai: Ai;
}
