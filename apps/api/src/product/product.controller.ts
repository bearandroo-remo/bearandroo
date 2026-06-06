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
  Req,
} from '@nestjs/common';
import {
  ProductService,
  CreateProductDto,
  UpdateProductDto,
} from './product.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('filters')
  getFilters(
    @Req() req: tenantMiddleware.TenantRequest,
    @Query('categoryId') categoryId?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('brandId') brandId?: string,
    @Query('collectionId') collectionId?: string,
  ) {
    return this.productService.getFilters(
      req.tenantId!,
      categoryId,
      categoryIds ? categoryIds.split(',') : undefined,
      brandId,
      collectionId,
    );
  }

  @Get()
  findAll(
    @Req() req: tenantMiddleware.TenantRequest,
    @Query('categoryId') categoryId?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('brandId') brandId?: string,
    @Query('collectionId') collectionId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('fulfillmentType') fulfillmentType?: string,
    @Query('sortBy') sortBy?: string,
    @Query('q') search?: string,
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
      'q',
    ];
    const attributes: Record<string, string> = {};
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (!reservedKeys.includes(key)) attributes[key] = value;
      }
    }

    return this.productService.findAll(
      req.tenantId!,
      categoryId,
      categoryIds ? categoryIds.split(',') : undefined,
      brandId,
      collectionId,
      Object.keys(attributes).length > 0 ? attributes : undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      inStock === 'true',
      fulfillmentType,
      sortBy,
      search,
    );
  }

  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.productService.findBySlug(slug, req.tenantId!);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  create(
    @Body() dto: CreateProductDto,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.productService.create(dto, req.tenantId!);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
