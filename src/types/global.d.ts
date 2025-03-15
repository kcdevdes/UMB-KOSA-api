import { User } from 'src/user/entity/user.entity';
import { Session } from 'express-session';

declare module 'express-session' {
  interface Session {
    user: User;
  }
}

declare module 'express' {
  interface Request {
    session: Session & { user?: User };
  }
}
