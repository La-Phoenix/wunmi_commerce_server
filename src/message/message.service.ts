// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Message, MessageDocument } from 'src/Schemas/message.schema';

// @Injectable()
// export class MessageService {
//   constructor(
//     @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
//   ) {}

//   async createMessage(data: Partial<Message>): Promise<Message> {
//     const message = new this.messageModel(data);
//     return message.save();
//   }

//   async updateMessage(id: string, content: string): Promise<Message | null> {
//     return this.messageModel
//       .findByIdAndUpdate(id, { content }, { new: true })
//       .exec();
//   }

//   async deleteMessage(id: string): Promise<void> {
//     await this.messageModel.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
//   }

//   async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
//     const room = [senderId, receiverId].sort();
//     return this.messageModel
//       .find({
//         senderId: { $in: room },
//         receiverId: { $in: room },
//         deletedAt: null, // Exclude deleted messages
//       })
//       .sort({ createdAt: 1 })
//       .exec();
//   }
// }

