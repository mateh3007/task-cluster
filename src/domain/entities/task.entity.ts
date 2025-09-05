import { TaskStatusEnum } from '../enums/task-status.enum';
import { BaseEntity } from './base.entity';

export interface TaskEntity extends BaseEntity {
  ownerId: number;
  companyId: number;
  name: string;
  description: string;
  expectedDurationInDays: number;
  durationInDays: number;
  status: TaskStatusEnum;
}
