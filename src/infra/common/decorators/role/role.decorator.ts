import { RoleValidatorUseCase } from '@application/use-cases/authentication/roles-validator/role-validator.use-case';
import { RoleEnum } from '@domain/enums/role.enum';
import { RoleGuard } from '@infra/common/guards/role/role.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const AUTH_DECORATOR_ROLES_METADATA_KEY = 'ROLES';

export const RoleDecorator = (roles: RoleEnum[]): MethodDecorator =>
  applyDecorators(
    SetMetadata(AUTH_DECORATOR_ROLES_METADATA_KEY, roles),
    UseGuards(new RoleGuard(new Reflector(), new RoleValidatorUseCase())),
  );
