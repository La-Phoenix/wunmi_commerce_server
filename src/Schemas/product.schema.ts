// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type ProductDocument = Product & Document;

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string; // URL or path for the uploaded image

  // Add an array of user references
  @Prop({ type: [{ type: Types.ObjectId}], ref: 'User'  })
  users: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
