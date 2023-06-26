import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

//FOREIGNERS
import { AiExample } from './ai_example.model';
import { Category } from './category.model';

@Table({ tableName: 'ais' })
export class Ai extends Model<Ai> {
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
  })
  logo: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @Column({
    type: DataType.TEXT,
  })
  site: string;

  @Column({
    type: DataType.TEXT,
  })
  twitter: string;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => AiExample)
  examples: AiExample[];
}
