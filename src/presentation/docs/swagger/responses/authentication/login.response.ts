import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionResponseDto } from '../error/exception';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
}

export const LoginResponses = applyDecorators(
  ApiOkResponse({
    description: 'Usuário logado com sucesso',
    type: LoginResponseDto,
  }),
  ApiUnauthorizedResponse({
    description: 'Usuário foi desativado.',
    type: ExceptionResponseDto,
  }),
  ApiBadRequestResponse({
    description: 'Credênciais inválidas',
    type: ExceptionResponseDto,
  }),
);
