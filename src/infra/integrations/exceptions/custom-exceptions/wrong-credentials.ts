import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('Credentials are not valid', HttpStatus.BAD_REQUEST);
  }
}
