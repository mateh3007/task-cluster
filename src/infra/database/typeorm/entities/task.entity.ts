import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { TaskStatusEnum } from 'src/domain/enums/task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  expectedDurationInDays: number;

  @Column()
  durationInDays: number;

  @Column({ type: 'enum', enum: TaskStatusEnum })
  status: TaskStatusEnum;
}
