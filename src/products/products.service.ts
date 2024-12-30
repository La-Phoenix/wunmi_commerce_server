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
  async fetchAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find({});
      return products;
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
  async fetchProductById(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId);
  
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
  
      return product;
    } catch (error) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
  async fetchProductsByCategory(categogry: string): Promise<Product[]> {
    try {
      const products = await this.productModel.find({
        category: categogry, // Ensure the product isn't flagged as deleted
      });
  
      if (products.length == 0) {
        throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
  
      return products;
    } catch (error) {
      throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
    }
  }
  
}
