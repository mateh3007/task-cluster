import { CreateUserUseCase } from '@application/use-cases/user/create/create-user.use-case';
import { UserEntity } from '@domain/entities/user.entity';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserResponses } from '@presentation/docs/swagger/responses/user/create-user.response';
import { CreateUserDto } from '@presentation/dtos/user/create-user.dto';

@ApiTags('User')
@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @CreateUserResponses
  async execute(@Body() body: CreateUserDto): Promise<UserEntity | void> {
    return await this.createUserUseCase.execute(body);
  }
}
