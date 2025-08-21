import { CreateCompanyUseCase } from '@application/use-cases/company/create/create-company.use-case';
import { CompanyEntity } from '@domain/entities/company.entity';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCompanyResponses } from '@presentation/docs/swagger/responses/company/create-company.response';
import { CreateCompanyDto } from '@presentation/dtos/company/create-company.dto';

@ApiTags('Company')
@Controller('company')
export class CreateCompanyController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

  @Post()
  @CreateCompanyResponses
  async execute(@Body() body: CreateCompanyDto): Promise<CompanyEntity | void> {
    return await this.createCompanyUseCase.execute(body);
  }
}
