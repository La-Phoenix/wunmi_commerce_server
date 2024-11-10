import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Product } from './product.schema';


// type DocumentWithId<T> = Omit<T, '_id'> & { id: T extends { _id: infer U } ? U : never };

// export type UserDocument = DocumentWithId<Document & User> & { __v: number };

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true }) // Ensure email is unique
  email: string;

  @Prop({ type: [{ type: Types.ObjectId }], ref: 'Product'}) // Foreign key to Product
  products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
