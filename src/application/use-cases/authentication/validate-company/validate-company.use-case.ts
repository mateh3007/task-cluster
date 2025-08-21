import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { CompanyEntity } from '@domain/entities/company.entity';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateCompanyUseCase {
  constructor(
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(domain: string): Promise<CompanyEntity | void> {
    const company = await this.companyRepository.findByDomain(domain);

    if (!company)
      return this.exceptionsAdapter.notFound({
        message: 'Company not found',
      });

    return company;
  }
}
