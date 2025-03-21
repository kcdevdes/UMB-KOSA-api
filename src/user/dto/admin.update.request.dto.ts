import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_ROLE } from '../entity/user.role';
import { USER_STATUS } from '../entity/user.status';
import UserUpdateRequestDto from './user.update.request.dto';

export class AdminUpdateRequestDto extends UserUpdateRequestDto {
  @IsEnum(USER_ROLE)
  @IsOptional()
  role: USER_ROLE;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(USER_STATUS)
  @IsOptional()
  status: USER_STATUS;
}
