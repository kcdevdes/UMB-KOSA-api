import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async generateToken(user: User): Promise<Token> {
    const token = new Token();
    token.token = uuidv4();
    token.user = user;
    token.createdAt = new Date();
    token.expiresAt = new Date(new Date().getTime() + 15 * 60 * 1000);

    return this.tokenRepository.save(token);
  }

  async findOneByToken(token: string): Promise<Token | null> {
    return this.tokenRepository.findOne({ where: { token } });
  }

  async isValid(token: string): Promise<boolean> {
    const tokenEntity = await this.findOneByToken(token);
    let result = false;
    if (tokenEntity) {
      if (new Date() < tokenEntity.expiresAt && token == tokenEntity.token) {
        result = true;
      }
    }

    return result;
  }

  async deletToken(token: string): Promise<void> {
    // Delete the token after it has been used
    // await this.tokenRepository.delete(tokenEntity);
    await this.tokenRepository.delete({ token });
  }
}
