import { BaseEntity } from './base.entity';

export interface CompanyEntity extends BaseEntity {
  domain: string;
  tradeName: string;
  corporateName: string;
  phone: string;
  cnpj: string;
  email: string;
}
