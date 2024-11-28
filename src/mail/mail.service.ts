// mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  private transporter = nodemailer.createTransport({
    service: this.configService.get<string>("mail.service"),
    auth: {
      user: this.configService.get<string>("mail.user"),
      pass: this.configService.get<string>("mail.pass"),
    },
    tls: {
      rejectUnauthorized:  this.configService.get<string>('app.environment') === 'production',
    },
  });

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `${this.configService.get<string>('app.clientUrl')}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to,
      from: this.configService.get<string>("mail.user"), // your email,
      subject: 'Reset Your Password',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #444; text-align: center;">Reset Your Password</h2>
        <p style="font-size: 16px;">
          Hello,
        </p>
        <p style="font-size: 16px;">
          We received a request to reset your password. Click the button below to reset it:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 10px 20px; font-size: 16px; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 16px;">
          If you didn't request this, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="font-size: 16px; color: #666; text-align: center;">
          If the button above doesn't work, copy and paste the link below into your browser:
        </p>
        <p style="font-size: 14px; word-break: break-word; text-align: center;">
          <a href="${resetLink}" style="color: #007bff;">${resetLink}</a>
        </p>
        <p style="font-size: 16px; color: #666; text-align: center;">
          Expires In 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">
          © ${new Date().getFullYear()} ${this.configService.get<string>("app.company_name")}. All rights reserved.
        </p>
      </div>
    `,
    });
  }
}
