import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import * as dotenv from 'dotenv';
import { ProductsModule } from './products/products.module';
import { User, UserSchema } from './Schemas/user.schema';
import { Product, ProductSchema } from './Schemas/product.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { mailConfig } from './config/mail.config';
import { dbConfig } from './config/db.config';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

dotenv.config();

@Module({
  imports: [ 
    MongooseModule.forRoot(process.env.MONGO_URI) ,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mailConfig, dbConfig], // Load configurations
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema }, // Register Product schema
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a more secure secret in production
      signOptions: { expiresIn: '1d' },
    }), AuthModule, ProductsModule, UserModule, MessageModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{

  constructor(@InjectConnection() private readonly connection: Connection) {}
  onModuleInit() {

    console.log('Attempting to connect to MongoDB...');

    this.connection.once('open', () => {
      console.log('Connected to MongoDB');
    });

    this.connection.on('error', (err) => {
      console.error('Error connecting to MongoDB:', err);
    });
  }
}
