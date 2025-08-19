import { CompanyEntity } from '@domain/entities/company.entity';

export abstract class CompanyRepository {
  abstract findById(id: number): Promise<CompanyEntity | void>;
  abstract findByDomain(domain: string): Promise<CompanyEntity | void>;
}
