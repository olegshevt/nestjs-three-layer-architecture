import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingModule } from './product-rating/product-rating.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { FibonacciModule } from './fibonacci/fibonacci.module';
import { DataSourceModule } from './data-source/data-source.module';
import { UsersModule } from './users/users.module';
import { ContextIdFactory } from '@nestjs/core';
import { AggregateByTenantContextIdStrategy } from './core/aggregate-by-tenant.strategy';
import { I18nModule } from './i18n/i18n.module';
import { AggregateByLocaleContextIdStrategy } from './core/aggregate-by-locale.strategy';
import { IamModule } from './iam/iam.module';

ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
ContextIdFactory.apply(new AggregateByLocaleContextIdStrategy());
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true,
    }),
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductRatingModule,
    CommonModule,
    FibonacciModule,
    DataSourceModule,
    UsersModule,
    I18nModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
