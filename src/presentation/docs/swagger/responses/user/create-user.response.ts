import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateUserResponses = applyDecorators(
  ApiCreatedResponse({
    description: 'User Successfully Created',
  }),
  ApiInternalServerErrorResponse({
    description: 'Error to Create User',
  }),
  ApiBadRequestResponse({
    description: 'User Already Exists',
  }),
);
