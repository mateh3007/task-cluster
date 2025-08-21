import { CreateCompanyUseCase } from '@application/use-cases/company/create/create-company.use-case';
import { Module } from '@nestjs/common';
import { CreateCompanyController } from '@presentation/controllers/company/create/create-company.controller';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseModule } from '../database/database.module';
import { ValidateCompanyUseCase } from '@application/use-cases/company/validate/validate-company.use-case';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [ExceptionsModule, DatabaseModule, CryptographyModule],
  controllers: [CreateCompanyController],
  providers: [CreateCompanyUseCase, ValidateCompanyUseCase],
})
export class CompanyModule {}
