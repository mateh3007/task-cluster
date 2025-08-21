import { AppDataSource } from '@infra/database/typeorm/data-source';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Module({
  providers: [
    {
      provide: DataSource,
      useValue: AppDataSource,
    },
  ],
  exports: [DataSource],
})
export class TypeOrmProviderModule {}
