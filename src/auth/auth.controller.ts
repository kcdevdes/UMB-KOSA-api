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
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import UserResponseDto from 'src/user/dto/user.response.dto';
import LoginRequestDto from './dto/login.request.dto';

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
    req.session.save();

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
}
