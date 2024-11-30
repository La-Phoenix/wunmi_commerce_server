import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserChats(@Req() req: any) {
        const userId = req.user.id;
        return this.chatService.getUserChats(userId);
    }
}
