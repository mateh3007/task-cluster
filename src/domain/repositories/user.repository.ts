import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserParams } from '@domain/interfaces/user.interfaces';

export abstract class IUserRepository {
  abstract createUser(params: CreateUserParams): Promise<UserEntity | void>;
  abstract findById(id: number): Promise<UserEntity | void>;
  abstract findByUuid(uuid: string): Promise<UserEntity | void>;
  abstract findByRegistration(registration: string): Promise<UserEntity | void>;
  abstract findByEmail(email: string): Promise<UserEntity | void>;
}
