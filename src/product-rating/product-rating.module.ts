import { Module } from '@nestjs/common';
import { ProductRatingService } from './product-rating.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [ProductRatingService],
})
export class ProductRatingModule {}
