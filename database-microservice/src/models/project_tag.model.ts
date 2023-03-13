import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

//FOREIGN
import { Project } from './project.model';
import { Tag } from './tag.model';

@Table({ tableName: 'projects_tags' })
export class ProjectTag extends Model<ProjectTag> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  project_id: number;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tag_id: number;

  @BelongsTo(() => Project, { onDelete: 'cascade' })
  project: Project;

  @BelongsTo(() => Tag, { onDelete: 'cascade' })
  tag: Tag;
}
