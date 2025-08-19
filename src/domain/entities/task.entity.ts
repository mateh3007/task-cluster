import { TaskStatusEnum } from '../enums/task-status.enum';
import { BaseEntity } from './base.entity';

export interface TaskEntity extends BaseEntity {
  userId: number;
  name: string;
  description: string;
  expectedDurationInDays: number;
  durationInDays: number;
  status: TaskStatusEnum;
}
