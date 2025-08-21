import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserParams } from '@domain/interfaces/user.interfaces';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repo: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User);
  }

  async createUser(params: CreateUserParams): Promise<UserEntity | void> {
    const user = this.repo.create(params);
    if (!user) return;
    return await this.repo.save(user);
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
