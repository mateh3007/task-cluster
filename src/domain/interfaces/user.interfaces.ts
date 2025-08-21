import { RoleEnum } from '@domain/enums/role.enum';

export interface CreateUserUseCaseParams {
  name: string;
  email: string;
  password: string;
  companyUuid: string;
  phone: string;
  registration: string;
}

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  companyUuid: string;
  phone: string;
  registration: string;
  role: RoleEnum;
}
