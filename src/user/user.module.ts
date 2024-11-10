import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ]),],
  exports: [UserService],
  providers: [UserService, JwtAuthGuard, JwtService],
  controllers: [UserController]
})
export class UserModule {}
