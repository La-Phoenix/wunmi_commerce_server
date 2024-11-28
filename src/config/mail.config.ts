import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  service: process.env.MAIL_SERVICE || 'gmail',
  user: process.env.EMAIL,
  pass: process.env.EMAIL_PASSWORD,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // For OAuth2 (optional)
  companyName: process.env.COMPANY_NAME, // For OAuth2 (optional)
}));