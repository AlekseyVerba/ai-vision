import { Model, Table, Column, DataType, HasMany, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant'

//FOREIGN
import { Project } from './project.model'

@Table({ tableName: 'project_files' })
export class ProjecFile extends Model<ProjecFile> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  type: FILE_TYPE

  @Column({
    type: DataType.TEXT,
    unique: true
  })
  value: string

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  project_id: number

  @BelongsTo(() => Project, {onDelete: 'cascade'})
  project: Project
}