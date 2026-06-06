import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

export { CreateBrandDto, UpdateBrandDto };

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBrandDto, tenantId: string) {
    return this.prisma.brand.create({ data: { ...dto, tenantId } });
  }

  findAll(tenantId: string) {
    return this.prisma.brand.findMany({
      where: { isActive: true, tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findBySlug(slug: string, tenantId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug_tenantId: { slug, tenantId } },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }
}
