import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Access } from '../entities/access.entity';
import { IAccessRepository } from '@domain/repositories/access.repository';
import { AccessEntity } from '@domain/entities/access.entity';

@Injectable()
export class AccessRepository implements IAccessRepository {
  private readonly repo: Repository<Access>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Access);
  }

  async findByUserIdAndCompanyId(
    userId: number,
    companyId: number,
  ): Promise<AccessEntity | void> {
    const access = await this.repo.findOne({ where: { userId, companyId } });
    if (!access) return;
    return access;
  }

  async findByEmailAndCompanyId(
    email: string,
    companyId: number,
  ): Promise<AccessEntity | void> {
    const access = await this.repo.findOne({ where: { email, companyId } });
    if (!access) return;
    return access;
  }

  async findById(id: number): Promise<AccessEntity | void> {
    const access = await this.repo.findOneBy({ id });
    if (!access) return;
    return access;
  }
}
