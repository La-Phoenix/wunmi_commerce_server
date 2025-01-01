import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User, UserDocument } from '../Schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async addProductToUser(userId: string, productId: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(
          userId, 
          { $addToSet: { products: productId } }, // `$addToSet` ensures no duplicate users are added
          { new: true }
        ).exec();
      };   

      async findUserWithProducts(userId: string): Promise<User> {
        const user = await this.userModel
          .findById(userId)
          .select('-password')
          .populate('products') // Populate the 'products' array with product details
          .exec();
    
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
    
        return user;
      }

      async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({email}).select('-password');
        return user;
      }

      async update(email: string, password: string): Promise<UpdateWriteOpResult> {
        const user = await this.userModel.updateOne({email}, { $set: { password } });
        return user;
      }

      async find(): Promise<User[]> {
        return this.userModel.find().exec();
      }
      async findUsersWithProducts(): Promise<User[]> {
        try {
          return this.userModel.find({ products: { $exists: true, $ne: [] } }).populate('products').exec();
        } catch (error) { 
          if (error instanceof HttpException) {
            throw error;
          }
          throw new InternalServerErrorException('An unexpected error occurred.');
        }
      }
      async findUserById(userId: string): Promise<User | null> {
        return this.userModel.findById(userId).exec();
      }
}
