import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Characteristic } from './entities/characteristic.entity';
import { EntityManager, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: EntityManager, useValue: {} },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Characteristic),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<MockRepository>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when product with ID exists', () => {
      it('should return the product object', async () => {
        const productId = 1;
        const expectedProduct = {};

        productRepository.findOne.mockReturnValue(expectedProduct);

        const product = await service.findOne(productId);
        expect(product).toEqual(expectedProduct);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const productId = 1;

        productRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(productId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Product ${productId} not found`);
        }
      });
    });
  });
});
