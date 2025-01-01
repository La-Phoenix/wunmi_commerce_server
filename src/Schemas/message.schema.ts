import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  updated: boolean;

  @Prop()
  timestamp: string;

  @Prop({ default: false }) // Soft delete flag
  deleted: boolean;

  @Prop({ type: Date, default: null }) // Optional field for the time of deletion
  deletedAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
``