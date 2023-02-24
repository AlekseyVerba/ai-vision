import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

//FOREIGN
import { ProjecPrivateFile } from './project_private_file.model'
import { User } from './user.model'

@Table({ tableName: 'users_project_private_file' })
export class UserProjectPrivateFile extends Model<UserProjectPrivateFile> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    user_uid: string

    @ForeignKey(() => ProjecPrivateFile)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    project_private_file_id: number

    @BelongsTo(() => ProjecPrivateFile, { onDelete: 'cascade' })
    private_file: ProjecPrivateFile;
  
    @BelongsTo(() => User, { onDelete: 'cascade' })
    user: User;
}