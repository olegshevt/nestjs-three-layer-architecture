import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductRatingService {
  constructor(private readonly productService: ProductsService) {}
}
