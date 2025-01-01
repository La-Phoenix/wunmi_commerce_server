import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config(); // Load environment variables from .env file

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);


  // app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    // origin: ['http://localhost:5173', 'https://la-phoenix.github.io/wunmi_store/', 'https://accounts.google.com'],
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

 
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// import * as cookieParser from 'cookie-parser';
// import serverlessExpress from '@vendia/serverless-express';
// import { APIGatewayProxyEvent, Context, Handler, Callback } from 'aws-lambda';

// dotenv.config();

// let server: Handler;

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(cookieParser());

//   app.enableCors({
//     origin: ['https://la-phoenix.github.io/wunmi_store', 'https://accounts.google.com'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//     exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   });

//   app.setGlobalPrefix('api/v1');
//   await app.init();

//   const expressApp = app.getHttpAdapter().getInstance();
//   return serverlessExpress({ app: expressApp });
// }

// export const handler: Handler = async (event, context, callback) => {
//   if (!server) {
//     server = await bootstrap(); // Only bootstrap the server once
//   }
//   return server(event, context, callback);
// };

