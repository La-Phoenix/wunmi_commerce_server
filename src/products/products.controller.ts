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
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from 'src/DTO/create-product.dto';
import { storage } from 'src/multer-storage-cloudinary';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/Schemas/user.schema';
import { Product } from 'src/Schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, 
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.fetchAllProducts();
  }

  // GET /products/:id - Get a single product by ID
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.fetchProductById(id);
  }
  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    console.log(category)
    return await this.productsService.fetchProductsByCategory(category);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage })) // FileInterceptor handles file upload
  async uploadAndCreateProduct(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto,
    @Request() req: Request & { user: User & { id: string}}, // For accessing the logged-in user
  ) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    if (!createProductDto || Object.keys(createProductDto).length === 0) {
      throw new HttpException('Product data not provided', HttpStatus.BAD_REQUEST);
    }

    try {
      // Check if a product with the same title, category, and user already exists
      const existingProduct = await this.productsService.findProductByDetails(
        req.user.id,
        createProductDto.name,
        createProductDto.category,
      ) as Product & {_id: string};

      if (existingProduct) {
        // If the product exists, throw a conflict error
        throw new HttpException('Product with this title and category already exists for this user', HttpStatus.CONFLICT);
      } else {

        
        const imageUrl = file.path;
        const product = await this.productsService.createProduct(createProductDto, imageUrl) as Product & {_id: string};
        
        // await this.productsService.addUserToProduct(product._id, req.user.id)  as Product & {_id: string};
        
        await this.userService.addProductToUser(req.user.id, product._id);
        return { message: 'Product created successfully', product };
      }
    } catch (error) { // If the error is an instance of HttpException, rethrow it
    if (error instanceof HttpException) {
      throw error;
    }
    // Otherwise, throw a generic internal server error
    throw new HttpException('An error occurred during product creation', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
 
}
