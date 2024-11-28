import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  clientUrl: process.env.FRONTEND_URL,
  company_name: process.env.COMPANY_NAME,
}));