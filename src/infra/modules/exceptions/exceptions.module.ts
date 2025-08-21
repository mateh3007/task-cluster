import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { ExceptionsIntegration } from '@infra/integrations/exceptions/exception.integration';
import { Module } from '@nestjs/common';

@Module({
  providers: [{ provide: ExceptionsAdapter, useClass: ExceptionsIntegration }],
  exports: [ExceptionsAdapter],
})
export class ExceptionsModule {}
