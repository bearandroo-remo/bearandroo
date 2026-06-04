import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ProductService,
  CreateProductDto,
  UpdateProductDto,
} from './product.service';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('collectionId') collectionId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('fulfillmentType') fulfillmentType?: string,
    @Query('sortBy') sortBy?: string,
    @Query() query?: Record<string, string>,
  ) {
    const reservedKeys = [
      'categoryId',
      'brandId',
      'collectionId',
      'minPrice',
      'maxPrice',
      'inStock',
      'fulfillmentType',
      'sortBy',
    ];
    const attributes: Record<string, string> = {};
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (!reservedKeys.includes(key)) attributes[key] = value;
      }
    }

    return this.productService.findAll(
      categoryId,
      brandId,
      collectionId,
      Object.keys(attributes).length > 0 ? attributes : undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      inStock === 'true',
      fulfillmentType,
      sortBy,
    );
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('filters')
  getFilters(
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('collectionId') collectionId?: string,
  ) {
    return this.productService.getFilters(categoryId, brandId, collectionId);
  }
}
