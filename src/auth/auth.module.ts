import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { EmailService } from './email.service';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    PassportModule.register({ session: true }),
    UserModule,
  ],
  providers: [AuthService, EmailService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
