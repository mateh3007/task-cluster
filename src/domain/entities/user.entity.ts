import { RoleEnum } from '../enums/role.enum';
import { BaseEntity } from './base.entity';

export interface UserEntity extends BaseEntity {
  companyId: number;
  role: RoleEnum;
  name: string;
  phone: string;
  registration: string;
  email: string;
  password: string;
}
