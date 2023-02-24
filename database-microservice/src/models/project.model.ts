import { Model, Table, Column, DataType, HasMany, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

//FOREIGN
import { User } from './user.model'
import { Category } from './category.model'
import { ProjectTag } from './project_tag.model'
import { Tag } from './tag.model'
import { ProjectAvatars } from './project_avatars.model'
import { ProjecFile } from './project_file.model'
import { UserProjectFavorite } from './user_project_favorite.model';
import { ProjecPrivateFile } from './project_private_file.model'

@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
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
    title: string
    
    @Column({
        type: DataType.TEXT,
    })
    description: string

    @Column({
        type: DataType.TEXT,
    })
    source: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_active: boolean


    @Column({
        type: DataType.INTEGER
    })
    price: number

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    author_uid: string

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number

    @HasOne(() => ProjectAvatars)
    avatars: ProjectAvatars

    @HasOne(() => ProjecPrivateFile)
    private_file: ProjecPrivateFile

    @HasMany(() => ProjecFile)
    files: ProjecFile[]

    @BelongsTo(() => User, { onDelete: 'cascade' })
    author: User

    @BelongsTo(() => Category)
    category: Category

    @BelongsToMany(() => User, () => UserProjectFavorite)
    users_favorite: User[];

    @BelongsToMany(() => Tag, () => ProjectTag)
    tags: Tag[];
}