import { BaseEntity } from './base.entity';

export interface AccessEntity extends BaseEntity {
  email: string;
  password: string;
  userId: number;
  companyId: number;
}
