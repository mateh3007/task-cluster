import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateTaskResponses = applyDecorators(
  ApiCreatedResponse({
    description: 'Task Successfully Created',
  }),
  ApiInternalServerErrorResponse({
    description: 'Error to Create Task',
  }),
);
