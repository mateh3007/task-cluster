import { RoleEnum } from '@domain/enums/role.enum';

export interface CreateUserUseCaseParams {
  companyDomain: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  registration: string;
}

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  companyId: number;
  phone: string;
  registration: string;
  role: RoleEnum;
}
