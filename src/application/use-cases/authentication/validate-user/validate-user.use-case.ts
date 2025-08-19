import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { AccessEntity } from '@domain/entities/access.entity';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private readonly exceptionsService: ExceptionsAdapter,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(access: AccessEntity): Promise<UserEntity | void> {
    const user = await this.userRepository.findById(access.userId);
    if (!user)
      return this.exceptionsService.notFound({
        message: 'User not found',
      });

    if (user.deletedAt)
      return this.exceptionsService.unauthorized({
        message: 'User has been deactivated',
      });

    return user;
  }
}
