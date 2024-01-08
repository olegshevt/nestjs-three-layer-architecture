import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,

    private readonly entityManager: EntityManager,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.productRepository.find({
      relations: ['characteristics'],
      skip: offset,
      take: limit,
    });
  }

  findOne(id: number) {
    const product = this.productRepository.findOne({
      where: { id },
      relations: ['characteristics'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const characteristics = await Promise.all(
      createProductDto.characteristics.map((name) =>
        this.preloadCharacteristicByName(name),
      ),
    );

    const product = this.productRepository.create({
      ...createProductDto,
      characteristics,
    });
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const characteristics =
      updateProductDto.characteristics &&
      (await Promise.all(
        updateProductDto.characteristics.map((name) =>
          this.preloadCharacteristicByName(name),
        ),
      ));

    const product = await this.productRepository.preload({
      id: +id,
      ...updateProductDto,
      characteristics,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  async recommendCoffee(product: Product) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      product.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_product';
      recommendEvent.type = 'product';
      recommendEvent.payload = { productId: product.id };

      await transactionalEntityManager.save(product);
      await transactionalEntityManager.save(recommendEvent);
    });
  }

  private async preloadCharacteristicByName(
    name: string,
  ): Promise<Characteristic> {
    const existingFlavor = await this.characteristicRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.characteristicRepository.create({ name });
  }
}
