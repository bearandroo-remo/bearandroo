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
import { BrandService, CreateBrandDto, UpdateBrandDto } from './brand.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  findAll(@Req() req: tenantMiddleware.TenantRequest) {
    return this.brandService.findAll(req.tenantId!);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  create(
    @Body() dto: CreateBrandDto,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.brandService.create(dto, req.tenantId!);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
