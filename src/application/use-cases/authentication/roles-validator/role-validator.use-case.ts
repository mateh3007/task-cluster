import { UserEntity } from '@domain/entities/user.entity';
import { RoleEnum } from '@domain/enums/role.enum';
import { Injectable } from '@nestjs/common';
@Injectable()
export class RoleValidatorUseCase {
  validate(roles: RoleEnum[], user?: UserEntity): boolean {
    if (!user) return false;

    const isRoleValid = roles.includes(user.role);

    return isRoleValid;
  }
}
