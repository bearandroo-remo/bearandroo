import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('seo')
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.seoService.findByProduct(productId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.seoService.findByCategory(categoryId);
  }

  @Put('product/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  upsertForProduct(
    @Param('productId') productId: string,
    @Body() dto: UpsertSeoDto,
  ) {
    return this.seoService.upsertForProduct(productId, dto);
  }

  @Put('category/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  upsertForCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: UpsertSeoDto,
  ) {
    return this.seoService.upsertForCategory(categoryId, dto);
  }

  @Get('product/:productId/schema')
  generateSchema(@Param('productId') productId: string) {
    return this.seoService.generateSchemaOrg(productId);
  }
}
