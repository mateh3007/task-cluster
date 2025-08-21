import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { CompanyEntity } from '@domain/entities/company.entity';
import { CreateCompanyParams } from '@domain/interfaces/company.interfaces';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { Injectable } from '@nestjs/common';
import { ValidateCompanyUseCase } from '../validate/validate-company.use-case';
import { CryptographyAdapter } from '@domain/adapters/cryptography.adapter';

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private readonly companyRepository: ICompanyRepository,
    private readonly validateCompanyUseCase: ValidateCompanyUseCase,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
  ) {}

  async execute(payload: CreateCompanyParams): Promise<CompanyEntity | void> {
    const companyAlreadyExists = await this.validateCompanyUseCase.execute({
      email: payload.email,
      cnpj: payload.cnpj,
      domain: payload.domain,
    });
    if (companyAlreadyExists) {
      return this.exceptionsAdapter.badRequest({
        message: 'Company Already Exists',
      });
    }

    const createdCompany = await this.companyRepository.createCompany({
      ...payload,
      password: await this.cryptographyAdapter.generateHash(payload.password),
    });
    if (!createdCompany) {
      return this.exceptionsAdapter.internalServerError({
        message: 'Failed To Create Company',
      });
    }

    return createdCompany;
  }
}
