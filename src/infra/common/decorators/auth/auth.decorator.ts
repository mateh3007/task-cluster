import { RouteAuthenticationUseCase } from '@application/use-cases/authentication/route-authentication/route-authentication.use-case';
import { AuthGuard } from '@infra/common/guards/auth/auth.guard';
import { AppDataSource } from '@infra/database/typeorm/data-source';
import { UserRepository } from '@infra/database/typeorm/repositories/user.repository';
import { JwtIntegration } from '@infra/integrations/token/jwt';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';

const userRepository = new UserRepository(AppDataSource);
const tokenService = new JwtIntegration(new JwtService());
const routerValidatorUseCase = new RouteAuthenticationUseCase(
  userRepository,
  tokenService,
);

export const AuthDecorator = (): MethodDecorator =>
  applyDecorators(
    UseGuards(new AuthGuard(routerValidatorUseCase)),
    ApiBearerAuth(),
  );
