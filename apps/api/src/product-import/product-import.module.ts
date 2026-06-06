import { Module } from '@nestjs/common';
import { ProductImportService } from './product-import.service';
import { ProductImportController } from './product-import.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductImportController],
  providers: [ProductImportService, PrismaService],
})
export class ProductImportModule {}
