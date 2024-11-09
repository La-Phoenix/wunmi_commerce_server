import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/Schemas/product.schema';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), HttpModule],
  providers: [ProductsService, JwtService, JwtAuthGuard],
  controllers: [ProductsController],
})
export class ProductsModule {}
