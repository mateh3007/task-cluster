import { RoleEnum } from '@domain/enums/role.enum';
import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

export const ApiRoleErrorResponse = (roles: RoleEnum[]): MethodDecorator =>
  applyDecorators(
    ApiForbiddenResponse({
      description: `Just users ${roles.join(', ')} can has access`,
    }),
  );
