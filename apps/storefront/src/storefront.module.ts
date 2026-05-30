import { Module } from '@nestjs/common';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';

@Module({
  imports: [],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
