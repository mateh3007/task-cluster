import { LoginUseCaseParams } from '@application/use-cases/authentication/login/login.use-case';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto implements LoginUseCaseParams {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'mail@mail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '12345678',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Domínio da escola',
    example: 'admin-dev.aletech.com.br',
  })
  @IsString()
  domain: string;
}
