import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Message } from 'src/Schemas/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private activeUsers: Map<string, Socket> = new Map();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, socket);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data.senderId, data.receiverId)
    const room = this.getRoomId(data.senderId, data.receiverId);
    socket.join(room);
    console.log(data.senderId, data.receiverId)

    const messages = await this.chatService.getMessages(
      data.senderId,
      data.receiverId,
    );

    socket.emit('chat_history', messages);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() message: {
      senderId: string;
      receiverId: string;
      content: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const room = this.getRoomId(message.senderId, message.receiverId);
    socket.join(room);
    const savedMessage = await this.chatService.saveMessage(message as Message);

    socket.emit('receive_message', savedMessage);
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @MessageBody() updateData: {
      messageId: string;
      content: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(updateData.messageId, updateData.content)
    const updatedMessage = await this.chatService.updateMessage(
      updateData.messageId,
      updateData.content,
    );
    console.log(updatedMessage)

    const room = this.getRoomId(updatedMessage.senderId, updatedMessage.receiverId);
    socket.join(room)
    socket.emit('message_updated', updatedMessage);
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @MessageBody() deleteData: { messageId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(deleteData)
    const deletedMessage = await this.chatService.deleteMessage(deleteData.messageId);

    const room = this.getRoomId(deletedMessage.senderId, deletedMessage.receiverId);
    socket.join(room)

    socket.emit('message_deleted', deletedMessage._id); // Notify clients
  }

  private getRoomId(buyerId: string, sellerId: string): string {
    return [buyerId, sellerId].sort().join('_');
  }
}
