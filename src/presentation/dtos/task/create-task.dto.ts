import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { TaskStatusEnum } from '@domain/enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Task name',
    example: 'Develop authentication module',
    required: true,
  })
  @Expose()
  name: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Implement login, register, and password recovery functionalities',
    required: true,
  })
  @Expose()
  description: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Expected duration of the task in days',
    example: 7,
    required: true,
  })
  @Expose()
  expectedDurationInDays: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Actual duration of the task in days',
    example: 5,
    required: true,
  })
  @Expose()
  durationInDays: number;

  @IsEnum(TaskStatusEnum)
  @ApiProperty({
    description: 'Current status of the task',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.PENDENT,
    required: true,
  })
  @Expose()
  status: TaskStatusEnum;
}
