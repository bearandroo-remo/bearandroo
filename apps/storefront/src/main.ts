import { NestFactory } from '@nestjs/core';
import { StorefrontModule } from './storefront.module';

async function bootstrap() {
  const app = await NestFactory.create(StorefrontModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
