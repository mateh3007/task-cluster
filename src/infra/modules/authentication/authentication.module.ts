import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoginController } from '@presentation/controllers/authentication/login.controller';
import { LoginUseCase } from '@application/use-cases/authentication/login/login.use-case';
import { ValidateUserUseCase } from '@application/use-cases/authentication/validate-user/validate-user.use-case';
import { ValidateCompanyUseCase } from '@application/use-cases/authentication/validate-company/validate-company.use-case';

@Module({
  imports: [TokenModule, CryptographyModule, DatabaseModule, ExceptionsModule],
  controllers: [LoginController],
  providers: [LoginUseCase, ValidateUserUseCase, ValidateCompanyUseCase],
})
export class AuthenticationModule {}
