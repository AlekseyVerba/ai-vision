import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

//FOREIGN
import { Project } from './project.model'

@Table({ tableName: 'categories'})
export class Category extends Model<Category> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    })
    id: number

    @Column({
        type: DataType.TEXT,
        unique: true
    })
    name: string

    @HasMany(() => Project)
    projects: []
}