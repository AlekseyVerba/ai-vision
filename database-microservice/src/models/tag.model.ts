import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';

//FOREIGN
import { ProjectTag } from './project_tag.model'
import { Project } from './project.model'

@Table({ tableName: 'tags' })
export class Tag extends Model<Tag> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false
  })
  name: string

  @BelongsToMany(() => Project, () => ProjectTag)
  projects: Project[];
}