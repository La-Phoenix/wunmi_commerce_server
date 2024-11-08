import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Product, ProductSchema } from './product.schema';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from 'google.strategy';
import { JwtStrategy } from 'jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema }, // Register Product schema
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a more secure secret in production
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
