/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  async upsertForProduct(productId: string, dto: UpsertSeoDto) {
    const schemaOrg = await this.generateSchemaOrg(productId);
    return this.prisma.seo.upsert({
      where: { productId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      create: { ...(dto as any), productId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      update: { ...(dto as any), schemaOrg },
    });
  }

  upsertForCategory(categoryId: string, dto: UpsertSeoDto) {
    return this.prisma.seo.upsert({
      where: { categoryId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      create: { ...(dto as any), categoryId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      update: dto as any,
    });
  }

  findByProduct(productId: string) {
    return this.prisma.seo.findUnique({ where: { productId } });
  }

  findByCategory(categoryId: string) {
    return this.prisma.seo.findUnique({ where: { categoryId } });
  }

  async generateSchemaOrg(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: { where: { isActive: true } },
        images: { where: { isMain: true } },
        category: true,
      },
    });

    if (!product) return null;

    const mainImage = product.images[0]?.url;
    product.variants.reduce(
      (min, v) => (Number(v.price) < min ? Number(v.price) : min),
      Number(product.variants[0]?.price ?? 0),
    );
    product.variants.some((v) => v.stock > 0);
    const lowestPrice = product.variants.reduce(
      (min, v) => (Number(v.price) < min ? Number(v.price) : min),
      Number(product.variants[0]?.price ?? 0),
    );
    const inStock = product.variants.some((v) => v.stock > 0);

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description ?? '',
      image: mainImage ?? '',
      category: product.category?.name ?? '',
      brand: {
        '@type': 'Brand',
        name: 'Bearandroo',
      },
      priceRange: `${lowestPrice} TRY`,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      offers: product.variants.map((v) => ({
        '@type': 'Offer',
        price: Number(v.price),
        priceCurrency: 'TRY',
        availability:
          v.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        sku: v.sku,
        itemCondition: 'https://schema.org/NewCondition',
      })),
    };
  }
}
