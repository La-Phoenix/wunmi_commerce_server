// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL, // your email
      pass: process.env.EMAIL_PASSWORD, // your email password
    },
  });

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to,
      subject: 'Reset Your Password',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<a href="${resetLink}">Reset Password</a>`,
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });
  }
}
