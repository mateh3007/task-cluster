import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserParams } from '@domain/interfaces/user.interfaces';
import { RoleEnum } from '@domain/enums/role.enum';
import { Access } from '../entities/access.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repo: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User);
  }

  async createUser(params: CreateUserParams): Promise<UserEntity | void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, {
        name: params.name,
        registration: params.registration,
        phone: params.phone,
        role: RoleEnum.EMPLOYEE,
        password: params.password,
        email: params.email,
        companyId: params.companyId,
      });
      const savedUser = await queryRunner.manager.save(user);

      const access = queryRunner.manager.create(Access, {
        email: params.email,
        password: params.password,
        userId: savedUser.id,
        companyId: params.companyId,
      });
      await queryRunner.manager.save(access);

      await queryRunner.commitTransaction();
      return {
        id: savedUser.id,
        uuid: savedUser.uuid,
        name: savedUser.name,
        registration: savedUser.registration,
        phone: savedUser.phone,
        role: RoleEnum.EMPLOYEE,
        password: savedUser.password,
        email: savedUser.email,
        companyId: savedUser.companyId,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        deletedAt: savedUser.deletedAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao criar empresa e usuário:', error);
      return;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<UserEntity | void> {
    const user = await this.repo.findOneBy({ id });
    if (!user) return;
    return user;
  }

  async findByUuid(uuid: string): Promise<UserEntity | void> {
    const user = await this.repo.findOne({ where: { uuid } });
    if (!user) return;
    return user;
  }

  async findByRegistration(registration: string): Promise<UserEntity | void> {
    const user = await this.repo.findOne({ where: { registration } });
    if (!user) return;
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | void> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) return;
    return user;
  }
}
