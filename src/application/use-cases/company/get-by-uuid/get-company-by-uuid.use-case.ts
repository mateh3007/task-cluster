import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { CompanyEntity } from '@domain/entities/company.entity';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCompanyByUuidUseCase {
  constructor(
    private readonly companyRepository: ICompanyRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(uuid: string): Promise<CompanyEntity | void> {
    const company = await this.companyRepository.findByUuid(uuid);
    if (!company) {
      return this.exceptionsAdapter.notFound({
        message: 'Company With this UUID not exists',
      });
    }

    return company;
  }
}
