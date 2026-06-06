import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://admin.bearandroo.com.tr',
      'https://cold-sea-5b2a.yunusoncel.workers.dev',
      'http://localhost:3000',
      'https://bearandroo.vercel.app',
      'https://bearandroo.com.tr',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT ?? '8080', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`Application running on port ${port}`);
}
bootstrap();
