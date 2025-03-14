import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('MAIL_USERNAME'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<string> {
    try {
      if (!to || !subject || !text) {
        throw new Error('Email, subject, and text are required');
      }

      await this.transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        text,
      });

      return `Email sent successfully to ${to}`;
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }
}
