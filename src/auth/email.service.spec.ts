import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('EmailService (Real SMTP Test)', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [EmailService, ConfigService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should send a real email', async () => {
    const to = 'gibeom.choi001@umb.edu';
    const subject = 'Test Email';
    const text = 'This is a test email from NestJS';

    const result = await service.sendEmail(to, subject, text);

    expect(result).toContain('Email sent successfully');
  });
});
