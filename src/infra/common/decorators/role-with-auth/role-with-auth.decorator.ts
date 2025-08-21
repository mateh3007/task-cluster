import { RoleEnum } from '@domain/enums/role.enum';
import { applyDecorators } from '@nestjs/common';
import { AuthDecorator } from '../auth/auth.decorator';
import { RoleDecorator } from '../role/role.decorator';

export const AuthWithRoleDecorator = (roles: RoleEnum[]): MethodDecorator =>
  applyDecorators(AuthDecorator(), RoleDecorator(roles));
