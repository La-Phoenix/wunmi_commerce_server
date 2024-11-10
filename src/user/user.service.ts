import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
