import { Module } from '@nestjs/common';
// import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  providers: [],
  controllers: [MessageController]
})
export class MessageModule {}
