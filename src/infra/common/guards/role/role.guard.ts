import { RoleValidatorUseCase } from '@application/use-cases/authentication/roles-validator/role-validator.use-case';
import { AuthenticatedRequest } from '@application/use-cases/authentication/route-authentication/route-authentication.use-case';
import { AUTH_DECORATOR_ROLES_METADATA_KEY } from '@infra/common/decorators/role/role.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleValidatorUseCase: RoleValidatorUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const roles = this.reflector.get(
      AUTH_DECORATOR_ROLES_METADATA_KEY,
      context.getHandler(),
    );

    return this.roleValidatorUseCase.execute(roles, request.user);
  }
}
