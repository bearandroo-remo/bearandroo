/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

export { CreateCollectionDto, UpdateCollectionDto };

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCollectionDto, tenantId: string) {
    const existing = await this.prisma.collection.findUnique({
      where: { slug_tenantId: { slug: dto.slug, tenantId } },
    });
    if (existing) throw new ConflictException('Slug already in use');
    return this.prisma.collection.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.collection.findMany({
      where: { isActive: true, tenantId },
      orderBy: { order: 'asc' },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                variants: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string, tenantId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug_tenantId: { slug, tenantId } },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                variants: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    return this.prisma.collection.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.update({
      where: { id },
      data: { isActive: false },
    });
  }

  addProduct(collectionId: string, productId: string) {
    return this.prisma.collectionProduct.create({
      data: { collectionId, productId },
    });
  }

  removeProduct(collectionId: string, productId: string) {
    return this.prisma.collectionProduct.delete({
      where: { collectionId_productId: { collectionId, productId } },
    });
  }
}
