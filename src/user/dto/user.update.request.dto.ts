import { IsOptional, IsString, IsUrl } from 'class-validator';
import { User } from '../entity/user.entity';

export default class UserUpdateRequestDto implements Partial<User> {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsUrl()
  @IsOptional()
  profileImageUrl: string;
}
