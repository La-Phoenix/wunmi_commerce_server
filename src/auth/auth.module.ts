import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from 'google.strategy';
import { JwtStrategy } from 'jwt.strategy';
import { MailService } from '../mail/mail.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a more secure secret in production
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, UserService, MailService, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
