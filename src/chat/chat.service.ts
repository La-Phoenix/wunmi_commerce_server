import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/Schemas/message.schema';
import { User, UserDocument } from 'src/Schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async saveMessage(message: Message): Promise<Message> {
    const newMessage = new this.messageModel(message);
    return newMessage.save();
  }

  async getMessages(senderId: string, receiverId: string ): Promise<Message[]> {
    const room = [senderId, receiverId].sort();
    console.log(room)
    const messages = await this.messageModel
    .find({
      senderId: { $in: room },
      receiverId: { $in: room },
      // deleted: false, // Exclude deleted messages
    })
    .sort({ createdAt: 1 })
    .exec();
    console.log(messages)
    return  messages
}

async updateMessage(messageId: string, content: string) {
  return this.messageModel.findByIdAndUpdate(
    messageId,
    { content, updated: true },
    { new: true }, // Return the updated document
  ).exec();
}

async deleteMessage(messageId: string) {
  return this.messageModel.findByIdAndUpdate(
    messageId,
    { deleted: true },
    { new: true }, // Return the updated document
  ).exec();
}

  async getUserChats(userId: string) {
    const chats = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            chatId: {
              $cond: [
                { $lt: ['$senderId', '$receiverId'] },
                { $concat: ['$senderId', '_', '$receiverId'] },
                { $concat: ['$receiverId', '_', '$senderId'] },
              ],
            },
          },
          lastMessage: { $first: '$content' },
          timestamp: { $first: '$createdAt' },
          buyerId: { $first: '$senderId' },
          sellerId: { $first: '$receiverId' },
        },
      },
      {
        $addFields: {
          otherUserId: {
            $toObjectId: {
              $cond: {
                if: { $eq: ['$buyerId', userId] },
                then: '$sellerId',
                else: '$buyerId',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users', // The name of your User collection
          localField: 'otherUserId',
          foreignField: '_id',
          as: 'otherUserDetails',
        },
      },
      {
        $unwind: '$otherUserDetails',
      },
      {
        $project: {
          chatId: '$_id.chatId',
          lastMessage: 1,
          timestamp: 1,
          buyerId: 1,
          sellerId: 1,
          otherUser: '$otherUserDetails.name', // Assuming the User schema has a "name" field
        },
      },
    ]);
    
    console.log(chats);
    
    return chats.map((chat) => ({
      chatId: chat.chatId,
      lastMessage: chat.lastMessage,
      timestamp: chat.timestamp,
      buyerId: chat.buyerId,
      sellerId: chat.sellerId,
      otherUser: chat.otherUser,
    }));
  }    

}
