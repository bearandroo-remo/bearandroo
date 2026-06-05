import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  CollectionService,
  CreateCollectionDto,
  UpdateCollectionDto,
} from './collection.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';

@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get()
  findAll(@Req() req: tenantMiddleware.TenantRequest) {
    return this.collectionService.findAll(req.tenantId!);
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.collectionService.findBySlug(slug, req.tenantId!);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  create(
    @Body() dto: CreateCollectionDto,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.collectionService.create(dto, req.tenantId!);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }

  @Post(':id/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  addProduct(@Param('id') id: string, @Body() body: { productId: string }) {
    return this.collectionService.addProduct(id, body.productId);
  }

  @Delete(':id/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.collectionService.removeProduct(id, productId);
  }
}
