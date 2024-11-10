import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateProductDto } from 'src/DTO/create-product.dto';
import { Product, ProductDocument } from 'src/Schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor( @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly httpService: HttpService) {}

  // Fetch all products
  async fetchAllProducts(): Promise<any> {
    try {
      const response = await firstValueFrom(this.httpService.get('https://api.escuelajs.co/api/v1/products'));
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch products', HttpStatus.BAD_GATEWAY);
    }
  }
  async createProduct(createProductDto: CreateProductDto, imageUrl: string): Promise<Product> {
    const newProduct = new this.productModel({ ...createProductDto, imageUrl, users: [] });
    return newProduct.save();
  }

  async findProductByDetails(userId: string, name: string, category: string): Promise<Product | null> {
    return this.productModel.findOne({
      name: name,
      category: category,
      users: userId, // Check if the userId is in the `users` array
    }).exec();
  }

  async addUserToProduct(productId: string, userId: string): Promise<Product> {
    return this.productModel.findByIdAndUpdate(
      productId,
      { $addToSet: { users: userId } }, // `$addToSet` ensures no duplicate users are added
      { new: true }
    ).exec();
  }

  // Fetch a single product by ID
  async fetchProductById(productId: number): Promise<any> {
    try {
      const response = await firstValueFrom(this.httpService.get(`https://api.escuelajs.co/api/v1/products/${productId}`));
      return response.data;
    } catch (error) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
