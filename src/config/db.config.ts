import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('database', () => ({
  mongo_url: process.env.MONGO_URI, 
}));
