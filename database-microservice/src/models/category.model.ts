import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

//FOREIGN
import { Project } from './project.model';
import { Ai } from './ai.model';

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {
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
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active: boolean;

  @HasMany(() => Project)
  projects: [];

  @HasMany(() => Ai)
  ais: [];
}
