import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserUseCaseParams } from '@domain/interfaces/user.interfaces';
import { IUserRepository } from '@domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { ValidateUserUseCase } from '../validate/validate-user.use-case';
import { RoleEnum } from '@domain/enums/role.enum';
import { CryptographyAdapter } from '@domain/adapters/cryptography.adapter';
import { ICompanyRepository } from '@domain/repositories/company.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly companyRepository: ICompanyRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
  ) {}

  async execute(payload: CreateUserUseCaseParams): Promise<UserEntity | void> {
    const company = await this.companyRepository.findByDomain(
      payload.companyDomain,
    );
    if (!company) {
      return this.exceptionsAdapter.notFound({
        message: 'Company With this Domain Not Exists',
      });
    }

    const userAlreadyExists = await this.validateUserUseCase.execute({
      email: payload.email,
      registration: payload.registration,
    });
    if (userAlreadyExists) {
      return this.exceptionsAdapter.notFound({
        message: 'User Already Exists',
      });
    }

    const createdUser = await this.userRepository.createUser({
      ...payload,
      companyId: company.id,
      password: await this.cryptographyAdapter.generateHash(payload.password),
      role: RoleEnum.EMPLOYEE,
    });

    if (!createdUser) {
      return this.exceptionsAdapter.internalServerError({
        message: 'Failed To Create User',
      });
    }

    return createdUser;
  }
}
