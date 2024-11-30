import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/Schemas/message.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/Schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService, JwtService],
  controllers: [ChatController]
})
export class ChatModule {}
