import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VariantModule } from './variant/variant.module';
import { ImageModule } from './image/image.module';
import { SeoModule } from './seo/seo.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    VariantModule,
    ImageModule,
    SeoModule,
    CollectionModule,
  ],
  controllers: [ApiController],
  providers: [ApiService, PrismaService],
  exports: [PrismaService],
})
export class ApiModule {}
