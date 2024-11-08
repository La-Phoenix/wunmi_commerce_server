import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET /products - Get all products
  @Get()
  async getAllProducts() {
    return await this.productService.fetchAllProducts();
  }

  // GET /products/:id - Get a single product by ID
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.fetchProductById(id);
  }
}
