// import {
//     WebSocketGateway,
//     SubscribeMessage,
//     ConnectedSocket,
//     MessageBody,
//   } from '@nestjs/websockets';
//   import { Socket } from 'socket.io';
//   import { MessagingService } from './messaging.service';
  
//   @WebSocketGateway()
//   export class MessagingGateway {
//     constructor(private readonly messagingService: MessagingService) {}
  
//     @SubscribeMessage('send_message')
//     async handleMessage(
//       @MessageBody() data: { senderId: string; receiverId: string; content: string },
//       @ConnectedSocket() client: Socket,
//     ) {
//       const message = await this.messagingService.saveMessage(data);
  
//       // Notify the receiver
//       client.to(data.receiverId).emit('receive_message', message);
//     }
  
//     @SubscribeMessage('join_chat')
//     handleJoinChat(
//       @MessageBody() userId: string,
//       @ConnectedSocket() client: Socket,
//     ) {
//       client.join(userId); // Join a room identified by the user's ID
//     }
//   }
  