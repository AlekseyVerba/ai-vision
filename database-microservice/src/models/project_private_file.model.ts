import { Model, Table, Column, DataType, HasMany, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant'

//FOREIGN
import { UserProjectPrivateFile } from './user_project_private_file.model'
import { Project } from './project.model'
import { User } from './user.model';

@Table({ tableName: 'project_private_file' })
export class ProjecPrivateFile extends Model<ProjecPrivateFile> {
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
  value: string

  @BelongsToMany(() => User, () => UserProjectPrivateFile)
  users_with_permissions: User[];

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  project_id: number

  @BelongsTo(() => Project, {onDelete: 'cascade'})
  project: Project
}