import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import UserResponseDto from './dto/user.response.dto';
import UserUpdateRequestDto from './dto/user.update.request.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyProfile(@Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    return new UserResponseDto(req.session.user);
  }

  @Patch('me')
  async updateMyProfile(
    @Body() dto: UserUpdateRequestDto,
    @Req() req: Request,
  ) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.userService.updateUser(
      req.session.user.id,
      dto,
    );
    req.session.user = updatedUser;

    return new UserResponseDto(updatedUser);
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: string, @Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user);
  }

  /// ADMIN ROUTERS ///

  @Get()
  async getAllUsers(@Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    if (req.session.user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const users = await this.userService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  @Patch(':id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() dto: UserUpdateRequestDto,
    @Req() req: Request,
  ) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    if (req.session.user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.userService.updateUser(id, dto);
    return new UserResponseDto(updatedUser);
  }

  /// Me & Admin ///
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    if (!req.session.user) {
      throw new UnauthorizedException();
    }

    if (req.session.user.role !== 'admin' || req.session.user.id === id) {
      throw new UnauthorizedException();
    }

    await this.userService.deleteUser(id);
  }
}
