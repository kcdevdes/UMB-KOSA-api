import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class TokenNotFoundException extends HttpException {
  constructor() {
    super('Token not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid Token', HttpStatus.UNAUTHORIZED);
  }
}

export class NoAuthorizationException extends HttpException {
  constructor() {
    super('Invalid Session', HttpStatus.UNAUTHORIZED);
  }
}
