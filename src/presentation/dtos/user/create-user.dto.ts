import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company domain',
    example: 'mycompany.com',
    required: true,
  })
  @Expose()
  companyDomain: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: true,
  })
  @Expose()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    required: true,
  })
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: 'User password (6-20 characters)',
    example: 'StrongPass123',
    required: true,
  })
  @Expose()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone must be a valid number with country code',
  })
  @ApiProperty({
    description: 'User phone number with country code',
    example: '+5511999999999',
    required: true,
  })
  @Expose()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User registration number',
    example: '123456',
    required: true,
  })
  @Expose()
  registration: string;
}
