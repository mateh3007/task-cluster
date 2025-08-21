import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';
import { AppDataSource } from '@infra/database/typeorm/data-source';
import { CompanyModule } from '../company/company.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthenticationModule,
    CompanyModule,
    UserModule,
    ExceptionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: DataSource,
      useValue: AppDataSource,
    },
  ],
})
export class AppModule {}
