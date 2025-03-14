import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import UserResponseDto from 'src/user/dto/user.response.dto';
import { User } from '../user/entity/user.entity';
import LoginRequestDto from './dto/login.request.dto';

declare module 'express-session' {
  interface Session {
    user: User;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.sendEmail(dto.email);
  }

  @Get('token')
  async verify(@Query('value') token: string, @Req() req: Request) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    const user = await this.authService.validateToken(token);
    req.session.user = user;

    return new UserResponseDto(user);
  }

  @Delete('token')
  async logout(@Req() req: Request, @Res() res) {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }
      res.clearCookie('connect.sid');
      res.send();
    });
  }

  @Get('me')
  async me(@Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException('Unauthorized Session Key');
    }

    return new UserResponseDto(req.session.user);
  }
}
