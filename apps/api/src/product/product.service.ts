import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export { CreateProductDto, UpdateProductDto };

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, tenantId: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug_tenantId: { slug: dto.slug, tenantId } },
    });
    if (existing) throw new ConflictException('Slug already in use');
    return this.prisma.product.create({ data: { ...dto, tenantId } });
  }

  async findAll(
    tenantId: string,
    categoryId?: string,
    categoryIds?: string[],
    brandId?: string,
    collectionId?: string,
    attributes?: Record<string, string>,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    fulfillmentType?: string,
    sortBy?: string,
    search?: string,
  ) {
    let productIds: string[] | undefined;

    if (collectionId) {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        include: { products: true },
      });
      productIds = collection?.products.map((p) => p.productId);
    }

    const where: Record<string, unknown> = { isActive: true, tenantId };
    if (categoryIds && categoryIds.length > 0) {
      where['categoryId'] = { in: categoryIds };
    } else if (categoryId) {
      where['categoryId'] = categoryId;
    }
    if (brandId) where['brandId'] = brandId;
    if (productIds) where['id'] = { in: productIds };
    if (fulfillmentType) where['fulfillmentType'] = fulfillmentType;
    if (search) {
      where['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const orderBy: Record<string, string> =
      sortBy === 'price_asc' || sortBy === 'price_desc'
        ? {}
        : { createdAt: 'desc' };

    let products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: { order: 'asc' } },
      },
      orderBy,
    });

    if (attributes && Object.keys(attributes).length > 0) {
      products = products.filter((p) =>
        p.variants.some((v) => {
          const attrs = v.attributes as Record<string, string>;
          return Object.entries(attributes).every(
            ([k, val]) => attrs[k] === val,
          );
        }),
      );
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      products = products.filter((p) =>
        p.variants.some((v) => {
          const price = Number(v.price);
          if (minPrice !== undefined && price < minPrice) return false;
          if (maxPrice !== undefined && price > maxPrice) return false;
          return true;
        }),
      );
    }

    if (inStock) {
      products = products.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    if (sortBy === 'price_asc') {
      products.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => Number(v.price)));
        const bMin = Math.min(...b.variants.map((v) => Number(v.price)));
        return aMin - bMin;
      });
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => Number(v.price)));
        const bMin = Math.min(...b.variants.map((v) => Number(v.price)));
        return bMin - aMin;
      });
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: { order: 'asc' } },
        details: { orderBy: { order: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string, tenantId: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug_tenantId: { slug, tenantId } },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: { order: 'asc' } },
        details: { orderBy: { order: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string) {
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getFilters(
    tenantId: string,
    categoryId?: string,
    categoryIds?: string[],
    brandId?: string,
    collectionId?: string,
  ) {
    let productIds: string[] | undefined;

    if (collectionId) {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        include: { products: true },
      });
      productIds = collection?.products.map((p) => p.productId);
    }

    const where: Record<string, unknown> = { isActive: true, tenantId };

    if (categoryIds && categoryIds.length > 0) {
      where['categoryId'] = { in: categoryIds };
    } else if (categoryId) {
      where['categoryId'] = categoryId;
    }

    if (brandId) where['brandId'] = brandId;
    if (productIds) where['id'] = { in: productIds };

    const products = await this.prisma.product.findMany({
      where,
      include: { variants: { where: { isActive: true } } },
    });

    const attributeMap: Record<string, Set<string>> = {};
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    for (const product of products) {
      for (const variant of product.variants) {
        const price = Number(variant.price);
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;

        const attrs = variant.attributes as Record<string, string>;
        for (const [key, value] of Object.entries(attrs)) {
          if (!attributeMap[key]) attributeMap[key] = new Set();
          attributeMap[key].add(value);
        }
      }
    }

    const attributes: Record<string, string[]> = {};
    for (const [key, values] of Object.entries(attributeMap)) {
      attributes[key] = Array.from(values);
    }

    return {
      attributes,
      price: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === -Infinity ? 0 : maxPrice,
      },
    };
  }
}
