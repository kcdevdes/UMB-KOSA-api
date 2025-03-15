import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import UserResponseDto from './dto/user.response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    return new UserResponseDto(req.session.user);
  }
}
