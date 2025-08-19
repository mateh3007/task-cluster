import { TokenAdapter } from '@domain/adapters/token.adapter';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

interface AuthenticatedHeader extends Headers {
  authorization?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserEntity;
  headers: AuthenticatedHeader;
}

@Injectable()
export class RouteAuthenticationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  public async execute(request: AuthenticatedRequest): Promise<boolean> {
    const bearerToken = request?.headers?.authorization;

    if (!bearerToken) return false;

    const token = bearerToken.split(' ')[1];
    const userSubscription = await this.tokenAdapter.getPayloadFromToken(token);

    if (!userSubscription) return false;

    const user = await this.userRepository.findById(userSubscription.id);

    if (!user) return false;

    request.user = user;

    return true;
  }
}
