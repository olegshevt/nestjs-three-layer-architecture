import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ); // whitelist removes properties that do not exist // forbidNonWhitelisted - returns error if non-existing property
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Products Catalog')
    .setDescription('Products Catalog Application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // app.useGlobalInterceptors(new TimeoutInterceptor()); //TimeoutInterceptor let to close connection after 3 sec.

  await app.listen(3000);
}
bootstrap();
