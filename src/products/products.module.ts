import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/Schemas/product.schema';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/Schemas/user.schema';

@Module({
  imports: [ MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema }, 
    { name: User.name, schema: UserSchema }
  ]), HttpModule],
  providers: [ProductsService, JwtService, JwtAuthGuard, UserService],
  controllers: [ProductsController],
})
export class ProductsModule {}
