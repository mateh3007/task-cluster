import { CompanyEntity } from '@domain/entities/company.entity';
import { CreateCompanyParams } from '@domain/interfaces/company.interfaces';

export abstract class ICompanyRepository {
  abstract createCompany(
    params: CreateCompanyParams,
  ): Promise<CompanyEntity | void>;
  abstract findById(id: number): Promise<CompanyEntity | void>;
  abstract findByUuid(uuid: string): Promise<CompanyEntity | void>;
  abstract findByDomain(domain: string): Promise<CompanyEntity | void>;
  abstract findByCnpj(cnpj: string): Promise<CompanyEntity | void>;
  abstract findByEmail(email: string): Promise<CompanyEntity | void>;
}
