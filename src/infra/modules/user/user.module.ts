import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateUserController } from '@presentation/controllers/user/create/create-user.controller';
import { CreateUserUseCase } from '@application/use-cases/user/create/create-user.use-case';
import { ValidateUserUseCase } from '@application/use-cases/user/validate/validate-user.use-case';

@Module({
  imports: [DatabaseModule, ExceptionsModule, CryptographyModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase, ValidateUserUseCase],
})
export class UserModule {}
