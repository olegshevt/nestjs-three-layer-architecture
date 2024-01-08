import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../../src/products/products.module';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { ConfigService, ConfigModule } from '@nestjs/config';

describe('[Feature] Products - /products', () => {
  const product = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    characteristics: ['chocolate', 'vanilla'],
  };
  let productId: number;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductsModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get('DATABASE_HOST'),
            port: 5433,
            username: config.get('DATABASE_USER'),
            password: config.get('DATABASE_PASSWORD'),
            database: config.get('DATABASE_NAME'),
            autoLoadEntities: true,
            synchronize: true, // Be cautious with this in production
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send(product as CreateProductDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedProduct = expect.objectContaining({
          ...product,
          characteristics: expect.arrayContaining(
            product.characteristics.map((name) =>
              expect.objectContaining({ name }),
            ),
          ),
        });

        expect(body).toEqual(expectedProduct);
        productId = body.id;
      });
  });
  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.length).toBe(1);
      });
  });
  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toHaveProperty('id', +productId);
        expect(body).toHaveProperty('name', product.name);
        expect(body).toHaveProperty('brand', product.brand);
      });
  });
  it('Update one [PATCH /:id]', async () => {
    const updatedProduct = {
      name: 'Updated Name',
      brand: 'Updated Brand',
      characteristics: ['cherry', 'vanilla'],
    };

    await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send(updatedProduct as UpdateProductDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toHaveProperty('name', updatedProduct.name);
        expect(body).toHaveProperty('brand', updatedProduct.brand);
      });
  });
  it('Delete one [DELETE /:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.dropDatabase();
    await app.close();
  });
});
