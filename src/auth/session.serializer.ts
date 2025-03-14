import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/entity/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: User, done: (err: null, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(
    user: User,
    done: (err: null, user: User | null) => void,
  ) {
    done(null, user);
  }
}
