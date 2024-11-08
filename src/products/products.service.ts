import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(private readonly httpService: HttpService) {}

  // Fetch all products
  async fetchAllProducts(): Promise<any> {
    try {
      const response = await firstValueFrom(this.httpService.get('https://api.escuelajs.co/api/v1/products'));
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch products', HttpStatus.BAD_GATEWAY);
    }
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
