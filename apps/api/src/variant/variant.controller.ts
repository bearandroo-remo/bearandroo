import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import type { CreateVariantDto, UpdateVariantDto } from './variant.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('variants')
export class VariantController {
  constructor(private variantService: VariantService) {}

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.variantService.findByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateVariantDto) {
    return this.variantService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.variantService.remove(id);
  }
}
