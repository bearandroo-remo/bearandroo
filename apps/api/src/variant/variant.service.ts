import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

export { CreateVariantDto, UpdateVariantDto };

@Injectable()
export class VariantService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVariantDto) {
    return this.prisma.variant.create({
      data: {
        ...dto,
        price: dto.price,
      },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.variant.findMany({
      where: { productId, isActive: true },
      include: { images: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  async update(id: string, dto: UpdateVariantDto) {
    await this.findOne(id);
    return this.prisma.variant.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.variant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
