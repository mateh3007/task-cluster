import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { CompanyEntity } from '@domain/entities/company.entity';
import { CreateCompanyParams } from '@domain/interfaces/company.interfaces';
import { User } from '../entities/user.entity';
import { RoleEnum } from '@domain/enums/role.enum';
import { Access } from '../entities/access.entity';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  private readonly repo: Repository<Company>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Company);
  }

  async createCompany(
    params: CreateCompanyParams,
  ): Promise<CompanyEntity | void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = queryRunner.manager.create(Company, {
        tradeName: params.tradeName,
        corporateName: params.corporateName,
        cnpj: params.cnpj,
        domain: params.domain,
        email: params.email,
        phone: params.phone,
      });
      const savedCompany = await queryRunner.manager.save(company);

      const user = queryRunner.manager.create(User, {
        name: params.tradeName,
        registration: params.cnpj,
        phone: params.phone,
        role: RoleEnum.ADMIN,
        password: params.password,
        email: params.email,
        companyId: savedCompany.id,
      });
      const savedUser = await queryRunner.manager.save(user);

      const access = queryRunner.manager.create(Access, {
        email: params.email,
        password: params.password,
        userId: savedUser.id,
        companyId: savedCompany.id,
      });
      await queryRunner.manager.save(access);

      await queryRunner.commitTransaction();
      return {
        id: savedCompany.id,
        uuid: savedCompany.uuid,
        corporateName: savedCompany.corporateName,
        tradeName: savedCompany.tradeName,
        cnpj: savedCompany.cnpj,
        phone: savedCompany.phone,
        email: savedCompany.email,
        domain: savedCompany.domain,
        createdAt: savedCompany.createdAt,
        updatedAt: savedCompany.updatedAt,
        deletedAt: savedCompany.deletedAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao criar empresa e usuário:', error);
      return;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<CompanyEntity | void> {
    const address = await this.repo.findOneBy({ id });
    if (!address) return;
    return address;
  }

  async findByUuid(uuid: string): Promise<CompanyEntity | void> {
    const address = await this.repo.findOne({ where: { uuid } });
    if (!address) return;
    return address;
  }

  async findByDomain(domain: string): Promise<CompanyEntity | void> {
    const address = await this.repo.findOne({ where: { domain } });
    if (!address) return;
    return address;
  }

  async findByCnpj(cnpj: string): Promise<CompanyEntity | void> {
    const address = await this.repo.findOne({ where: { cnpj } });
    if (!address) return;
    return address;
  }

  async findByEmail(email: string): Promise<CompanyEntity | void> {
    const address = await this.repo.findOne({ where: { email } });
    if (!address) return;
    return address;
  }
}
