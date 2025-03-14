import { User } from '../entity/user.entity';
import { USER_ROLE } from '../entity/user.role';
import { USER_STATUS } from '../entity/user.status';

export default class UserResponseDto {
  id: string;
  username: string;
  email: string;
  bio: string;
  role: USER_ROLE;
  status: USER_STATUS;
  profileImageUrl: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.bio = user.bio;
    this.role = user.role;
    this.status = user.status;
    this.profileImageUrl = user.profileImageUrl;
  }
}
