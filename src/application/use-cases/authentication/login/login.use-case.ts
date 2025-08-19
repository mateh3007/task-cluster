import { CryptographyAdapter } from '@domain/adapters/cryptography.adapter';
import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { TokenAdapter } from '@domain/adapters/token.adapter';
import { Injectable } from '@nestjs/common';
import { ValidateUserUseCase } from '../validate-user/validate-user.use-case';
import { ValidateCompanyUseCase } from '../validate-school/validate-school.use-case';
import { CompanyRepository } from '@domain/repositories/company.repository';
import { AccessRepository } from '@domain/repositories/access.repository';

export interface LoginUseCaseParams {
  email: string;
  password: string;
  domain: string;
}

export type LoginUseCaseReturn = Promise<{ accessToken: string } | void>;

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly accessRepository: AccessRepository,
    private readonly tokenAdapter: TokenAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly validateCompanyUseCase: ValidateCompanyUseCase,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(payload: LoginUseCaseParams): LoginUseCaseReturn {
    const company = await this.companyRepository.findByDomain(payload.domain);

    if (!company) {
      return this.exceptionsAdapter.badRequest({ message: 'Invalid domain' });
    }

    const access = await this.accessRepository.findByEmailAndCompanyId(
      payload.email,
      company.id,
    );
    if (!access) {
      return this.exceptionsAdapter.wrongCredentials();
    }

    const isValidCompany = await this.validateCompanyUseCase.execute(
      payload.domain,
    );
    if (!isValidCompany) return;

    const isValidUser = await this.validateUserUseCase.execute(access);
    if (!isValidUser) return;

    const isPasswordValid = await this.cryptographyAdapter.compare(
      payload.password,
      access.password,
    );
    if (!isPasswordValid) {
      return this.exceptionsAdapter.wrongCredentials();
    }

    const accessToken = await this.tokenAdapter.generateToken({
      id: isValidUser.id,
    });

    return {
      accessToken,
    };
  }
}
