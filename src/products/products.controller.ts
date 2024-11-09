// src/products/products.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from 'src/DTO/create-product.dto';
import { storage } from 'src/multer-storage-cloudinary';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.fetchAllProducts();
  }

  // GET /products/:id - Get a single product by ID
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.fetchProductById(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage })) // FileInterceptor handles file upload
  async uploadAndCreateProduct(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto
  ) {
    console.log(file)
    // // Upload the image and get its Cloudinary URL
    // const imageUrl = await this.productService.uploadProductImage(file);
    
    // // Create the product with the received data and image URL
    // const newProduct = await this.productService.createProduct(createProductDto, imageUrl);
    
    // return { message: 'Product created successfully', product: newProduct };
  }
 
}
