import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import * as dotenv from 'dotenv';
import { ProductModule } from './products/products.module';

dotenv.config();

@Module({
  imports: [ MongooseModule.forRoot(process.env.MONGO_URI), AuthModule, ProductModule],
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
