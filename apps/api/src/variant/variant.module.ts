import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [VariantController],
  providers: [VariantService, PrismaService],
  exports: [VariantService],
})
export class VariantModule {}
