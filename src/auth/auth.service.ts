import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { EmailService } from './email.service';
import { TokenService } from './token.service';
import { Token } from './entity/token.entity';
import { User } from 'src/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { InvalidTokenException } from 'src/exception/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokenForEmail(email: string): Promise<Token> {
    let user = await this.userService.findOneByEmail(email);
    if (!user) {
      user = await this.registerNewUser(email);
    }

    const token = await this.tokenService.generateToken(user);
    return token;
  }

  private async registerNewUser(email: string): Promise<User> {
    const user = await this.userService.createUser(email.split('@')[0], email);

    return user;
  }

  async sendEmail(email: string): Promise<string> {
    const token = await this.generateTokenForEmail(email);

    const subject = 'KOSA Verification Email';
    const text = `Hello! Please click the following link to verify your email:${this.configService.get<string>('BASE_URL')}/auth/token?value=${token.token}`;

    return this.emailService.sendEmail(email, subject, text);
  }

  async validateToken(token: string): Promise<User | null> {
    const isValid = await this.tokenService.isValid(token);
    if (!isValid) {
      throw new InvalidTokenException();
    }

    const tokenEntity = await this.tokenService.findOneByToken(token);
    if (!tokenEntity) {
      throw new InvalidTokenException();
    }

    // Delete the token after it has been used
    await this.tokenService.deletToken(token);

    return tokenEntity.user;
  }
}
