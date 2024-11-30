import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User, UserDocument } from 'src/Schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async addProductToUser(userId: string, productId: string): Promise<User> {
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

      async findByEmail(email: string): Promise<User> {
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
      async findUserById(userId: string): Promise<User> {
        return this.userModel.findById(userId).exec();
      }
}
