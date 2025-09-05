import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { UserEntity } from '@domain/entities/user.entity';
import { RoleEnum } from '@domain/enums/role.enum';
import { Injectable } from '@nestjs/common';

export type RoleHandlerParam = Partial<Record<RoleEnum, () => unknown>>;

@Injectable()
export class RoleHandlerUseCase {
  constructor(protected readonly exceptionsService: ExceptionsAdapter) {}

  handler<T>(roles: RoleHandlerParam, user: UserEntity): T {
    const rolesMap = new Map();
    const roleKeys = Object.keys(roles);

    for (const role of roleKeys) {
      rolesMap.set(role, roles[role]);
    }

    const roleMethod = rolesMap.get(user.role);

    if (!roleMethod) {
      this.exceptionsService.forbidden({
        message: `Only users ${roleKeys.join(', ')} can access this route`,
      });
      throw new Error('Forbidden');
    }

    return roleMethod();
  }
}
