import { Module} from '@nestjs/common';
import { ProductController } from './products.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductService } from './products.service';

@Module({
  imports: [HttpModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
