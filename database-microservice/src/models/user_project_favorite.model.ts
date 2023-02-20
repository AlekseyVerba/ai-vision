import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

//FOREIGN
import { Project } from './project.model'
import { User } from './user.model'

@Table({ tableName: 'users_projects_favorite' })
export class UserProjectFavorite extends Model<UserProjectFavorite> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    user_uid: string

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    project_id: number

    @BelongsTo(() => Project, { onDelete: 'cascade' })
    project: Project;
  
    @BelongsTo(() => User, { onDelete: 'cascade' })
    user: User;
}