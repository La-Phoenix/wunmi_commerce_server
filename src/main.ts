import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from "cookie-parser";


dotenv.config(); // Load environment variables from .env file

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'https://accounts.google.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

 
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
