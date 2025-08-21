import { UserEntity } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

export interface ValidateUserParams {
  registration?: string;
  email?: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(payload: ValidateUserParams): Promise<boolean> {
    let user: UserEntity | void;
    if (payload.registration) {
      user = await this.userRepository.findByRegistration(payload.registration);
      if (!user) return false;
    }
    if (payload.email) {
      user = await this.userRepository.findByEmail(payload.email);
      if (!user) return false;
    }

    return true;
  }
}
