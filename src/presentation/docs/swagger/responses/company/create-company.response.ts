import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateCompanyResponses = applyDecorators(
  ApiCreatedResponse({
    description: 'Company Successfully Created',
  }),
  ApiInternalServerErrorResponse({
    description: 'Error to Create Company',
  }),
  ApiBadRequestResponse({
    description: 'Company Already Exists',
  }),
);
