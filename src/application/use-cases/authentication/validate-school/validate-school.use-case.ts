import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { CompanyEntity } from '@domain/entities/company.entity';
import { CompanyRepository } from '@domain/repositories/company.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateCompanyUseCase {
  constructor(
    private readonly exceptionsService: ExceptionsAdapter,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(domain: string): Promise<CompanyEntity | void> {
    const company = await this.companyRepository.findByDomain(domain);

    if (!company)
      return this.exceptionsService.notFound({
        message: 'Company not found',
      });

    return company;
  }
}
