/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'empresa.com.br' })
  @Expose()
  @IsString()
  domain: string;

  @ApiProperty({ example: 'Empresa LTDA' })
  @Expose()
  @IsString()
  tradeName: string;

  @ApiProperty({ example: 'Empresa Comercial LTDA' })
  @Expose()
  @IsString()
  corporateName: string;

  @ApiProperty({ example: '+55 84 99999-9999' })
  @Expose()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @Expose()
  @IsString()
  cnpj: string;

  @ApiProperty({ example: 'contato@empresa.com.br' })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @Expose()
  @IsString()
  password: string;
}
