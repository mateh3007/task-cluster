import { CompanyEntity } from '@domain/entities/company.entity';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { Injectable } from '@nestjs/common';

export interface ValidateCompanyParams {
  cnpj?: string;
  email?: string;
  domain?: string;
  uuid?: string;
}

@Injectable()
export class ValidateCompanyUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async execute(payload: ValidateCompanyParams): Promise<boolean> {
    let company: CompanyEntity | void;
    if (payload.cnpj) {
      company = await this.companyRepository.findByCnpj(payload.cnpj);
      if (!company) return false;
    }
    if (payload.email) {
      company = await this.companyRepository.findByEmail(payload.email);
      if (!company) return false;
    }
    if (payload.domain) {
      company = await this.companyRepository.findByDomain(payload.domain);
      if (!company) return false;
    }
    if (payload.uuid) {
      company = await this.companyRepository.findByUuid(payload.uuid);
      if (!company) return false;
    }

    return true;
  }
}
