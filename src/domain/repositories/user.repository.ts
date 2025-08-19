import { UserEntity } from '@domain/entities/user.entity';

export abstract class UserRepository {
  abstract findById(id: number): Promise<UserEntity | void>;
  abstract findByUuid(id: number): Promise<UserEntity | void>;
}
