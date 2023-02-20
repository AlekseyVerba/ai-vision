import { Model, Table, Column, DataType, HasMany, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

//FOREIGN
import { Project } from './project.model'

@Table({ tableName: 'project_avatars' })
export class ProjectAvatars extends Model<ProjectAvatars> {
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
  middle: string

  @Column({
    type: DataType.TEXT,
    unique: true
  })
  default: string

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  project_id: number

  @BelongsTo(() => Project, {onDelete: 'cascade'})
  project: Project
}