import {
  LoginUseCase,
  LoginUseCaseReturn,
} from '@application/use-cases/authentication/login/login.use-case';
import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginResponses } from '@presentation/docs/swagger/responses/authentication/login.response';
import { LoginDto } from '@presentation/dtos/authentication/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginResponses
  async login(@Body() body: LoginDto): LoginUseCaseReturn {
    return await this.loginUseCase.execute(body);
  }
}
