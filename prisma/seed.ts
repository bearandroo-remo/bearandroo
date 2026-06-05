/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  PrismaClient,
  FulfillmentType,
  DetailType,
} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding...');

  // Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'bearandroo' },
    update: {},
    create: {
      id: 'default-tenant-id',
      name: 'Bearandroo',
      slug: 'bearandroo',
      domain: 'bearandroo.com.tr',
      apiKey: 'bearandroo-api-key-2026',
      isActive: true,
      plan: 'PRO',
    },
  });

  // Super Admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: {
      email_tenantId: { email: 'admin@bearandroo.com.tr', tenantId: tenant.id },
    },
    update: {},
    create: {
      email: 'admin@bearandroo.com.tr',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  });
  console.log('✓ Tenant & Admin');

  // Markalar
  const bearandroo = await prisma.brand.upsert({
    where: { slug_tenantId: { slug: 'bearandroo', tenantId: tenant.id } },
    update: {},
    create: { name: 'Bearandroo', slug: 'bearandroo', tenantId: tenant.id },
  });

  const basicWear = await prisma.brand.upsert({
    where: { slug_tenantId: { slug: 'basic-wear', tenantId: tenant.id } },
    update: {},
    create: { name: 'Basic Wear', slug: 'basic-wear', tenantId: tenant.id },
  });
  console.log('✓ Markalar');

  // Kategoriler
  const kadin = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'kadin', tenantId: tenant.id } },
    update: {},
    create: { name: 'Kadın', slug: 'kadin', order: 1, tenantId: tenant.id },
  });

  const erkek = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'erkek', tenantId: tenant.id } },
    update: {},
    create: { name: 'Erkek', slug: 'erkek', order: 2, tenantId: tenant.id },
  });

  const kadinUst = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'kadin-ust-giyim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Üst Giyim',
      slug: 'kadin-ust-giyim',
      parentId: kadin.id,
      order: 1,
      tenantId: tenant.id,
    },
  });

  const kadinAlt = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'kadin-alt-giyim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Alt Giyim',
      slug: 'kadin-alt-giyim',
      parentId: kadin.id,
      order: 2,
      tenantId: tenant.id,
    },
  });

  const kadinDis = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'kadin-dis-giyim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Dış Giyim',
      slug: 'kadin-dis-giyim',
      parentId: kadin.id,
      order: 3,
      tenantId: tenant.id,
    },
  });

  const erkekUst = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'erkek-ust-giyim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Üst Giyim',
      slug: 'erkek-ust-giyim',
      parentId: erkek.id,
      order: 1,
      tenantId: tenant.id,
    },
  });

  const erkekAlt = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'erkek-alt-giyim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Alt Giyim',
      slug: 'erkek-alt-giyim',
      parentId: erkek.id,
      order: 2,
      tenantId: tenant.id,
    },
  });
  console.log('✓ Kategoriler');

  // Ürünler
  const products = [
    {
      name: 'Basic Beyaz T-Shirt',
      slug: 'basic-beyaz-t-shirt',
      description: 'Günlük kullanım için ideal %100 pamuklu basic t-shirt.',
      categoryId: kadinUst.id,
      brandId: bearandroo.id,
      fulfillmentType: FulfillmentType.READY,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%100 Pamuk',
          order: 0,
        },
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kalıp',
          value: 'Regular Fit',
          order: 1,
        },
        {
          group: 'Bakım',
          type: DetailType.KEY_VALUE,
          key: 'Yıkama',
          value: '30 derecede yıkayınız',
          order: 0,
        },
        {
          group: 'Teslimat',
          type: DetailType.RICH_TEXT,
          key: null,
          value:
            '<p>Stokta olan ürünler <strong>1-3 iş günü</strong> içinde kargoya verilir.</p>',
          order: 0,
        },
      ],
      variants: [
        {
          sku: 'BBT-XS',
          price: 199.99,
          stock: 20,
          attributes: { Beden: 'XS', Renk: 'Beyaz' },
        },
        {
          sku: 'BBT-S',
          price: 199.99,
          stock: 15,
          attributes: { Beden: 'S', Renk: 'Beyaz' },
        },
        {
          sku: 'BBT-M',
          price: 199.99,
          stock: 10,
          attributes: { Beden: 'M', Renk: 'Beyaz' },
        },
        {
          sku: 'BBT-L',
          price: 199.99,
          stock: 8,
          attributes: { Beden: 'L', Renk: 'Beyaz' },
        },
        {
          sku: 'BBT-XL',
          price: 199.99,
          stock: 0,
          attributes: { Beden: 'XL', Renk: 'Beyaz' },
        },
      ],
    },
    {
      name: 'Oversize Siyah T-Shirt',
      slug: 'oversize-siyah-t-shirt',
      description: 'Trend oversize kesim, siyah pamuklu t-shirt.',
      categoryId: kadinUst.id,
      brandId: bearandroo.id,
      fulfillmentType: FulfillmentType.READY,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%100 Pamuk',
          order: 0,
        },
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kalıp',
          value: 'Oversize',
          order: 1,
        },
      ],
      variants: [
        {
          sku: 'OST-S',
          price: 249.99,
          stock: 12,
          attributes: { Beden: 'S', Renk: 'Siyah' },
        },
        {
          sku: 'OST-M',
          price: 249.99,
          stock: 10,
          attributes: { Beden: 'M', Renk: 'Siyah' },
        },
        {
          sku: 'OST-L',
          price: 249.99,
          stock: 8,
          attributes: { Beden: 'L', Renk: 'Siyah' },
        },
        {
          sku: 'OST-XL',
          price: 249.99,
          stock: 0,
          attributes: { Beden: 'XL', Renk: 'Siyah' },
        },
      ],
    },
    {
      name: 'Slim Fit Jean',
      slug: 'slim-fit-jean',
      description: 'Modern slim fit kesim, yüksek kaliteli denim kumaş.',
      categoryId: kadinAlt.id,
      brandId: basicWear.id,
      fulfillmentType: FulfillmentType.READY,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%98 Pamuk, %2 Elastan',
          order: 0,
        },
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kalıp',
          value: 'Slim Fit',
          order: 1,
        },
      ],
      variants: [
        {
          sku: 'SFJ-28-M',
          price: 499.99,
          stock: 10,
          attributes: { Beden: '28', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-30-M',
          price: 499.99,
          stock: 8,
          attributes: { Beden: '30', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-32-M',
          price: 499.99,
          stock: 6,
          attributes: { Beden: '32', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-28-S',
          price: 499.99,
          stock: 5,
          attributes: { Beden: '28', Renk: 'Siyah' },
        },
      ],
    },
    {
      name: 'Kışlık Kaşmir Kazak',
      slug: 'kislik-kasmir-kazak',
      description:
        'El yapımı özel kaşmir kazak. Sipariş sonrası üretilmektedir.',
      categoryId: kadinUst.id,
      brandId: bearandroo.id,
      fulfillmentType: FulfillmentType.MADE_TO_ORDER,
      productionDays: 7,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%100 Kaşmir',
          order: 0,
        },
        {
          group: 'Teslimat',
          type: DetailType.RICH_TEXT,
          key: null,
          value:
            '<p>Bu ürün <strong>sipariş üzerine üretilmektedir</strong>. Üretim süresi 7 iş günüdür.</p>',
          order: 0,
        },
      ],
      variants: [
        {
          sku: 'KKK-S-BEJ',
          price: 1299.99,
          stock: 999,
          attributes: { Beden: 'S', Renk: 'Bej' },
        },
        {
          sku: 'KKK-M-BEJ',
          price: 1299.99,
          stock: 999,
          attributes: { Beden: 'M', Renk: 'Bej' },
        },
        {
          sku: 'KKK-S-GRI',
          price: 1299.99,
          stock: 999,
          attributes: { Beden: 'S', Renk: 'Gri' },
        },
      ],
    },
    {
      name: 'Erkek Basic Polo',
      slug: 'erkek-basic-polo',
      description: 'Klasik polo yaka, günlük kullanım için ideal.',
      categoryId: erkekUst.id,
      brandId: basicWear.id,
      fulfillmentType: FulfillmentType.READY,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%100 Pamuk Pique',
          order: 0,
        },
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kalıp',
          value: 'Regular Fit',
          order: 1,
        },
      ],
      variants: [
        {
          sku: 'EBP-S-L',
          price: 279.99,
          stock: 15,
          attributes: { Beden: 'S', Renk: 'Lacivert' },
        },
        {
          sku: 'EBP-M-L',
          price: 279.99,
          stock: 12,
          attributes: { Beden: 'M', Renk: 'Lacivert' },
        },
        {
          sku: 'EBP-L-L',
          price: 279.99,
          stock: 10,
          attributes: { Beden: 'L', Renk: 'Lacivert' },
        },
        {
          sku: 'EBP-S-B',
          price: 279.99,
          stock: 10,
          attributes: { Beden: 'S', Renk: 'Bordo' },
        },
      ],
    },
    {
      name: 'Erkek Kargo Pantolon',
      slug: 'erkek-kargo-pantolon',
      description: 'Çok cepli kargo pantolon, outdoor ve günlük kullanım için.',
      categoryId: erkekAlt.id,
      brandId: basicWear.id,
      fulfillmentType: FulfillmentType.READY,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%65 Polyester, %35 Pamuk',
          order: 0,
        },
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Cep Sayısı',
          value: '8 Cep',
          order: 1,
        },
      ],
      variants: [
        {
          sku: 'EKP-30-H',
          price: 449.99,
          stock: 8,
          attributes: { Beden: '30', Renk: 'Haki' },
        },
        {
          sku: 'EKP-32-H',
          price: 449.99,
          stock: 6,
          attributes: { Beden: '32', Renk: 'Haki' },
        },
        {
          sku: 'EKP-30-S',
          price: 449.99,
          stock: 5,
          attributes: { Beden: '30', Renk: 'Siyah' },
        },
      ],
    },
    {
      name: 'Kadın Trençkot',
      slug: 'kadin-trencot',
      description: 'Klasik trençkot tasarımı, her mevsim kullanıma uygun.',
      categoryId: kadinDis.id,
      brandId: bearandroo.id,
      fulfillmentType: FulfillmentType.MADE_TO_ORDER,
      productionDays: 5,
      details: [
        {
          group: 'Ürün Özellikleri',
          type: DetailType.KEY_VALUE,
          key: 'Kumaş',
          value: '%70 Polyester, %30 Pamuk',
          order: 0,
        },
        {
          group: 'Teslimat',
          type: DetailType.RICH_TEXT,
          key: null,
          value:
            '<p>Bu ürün <strong>sipariş üzerine üretilmektedir</strong>. Üretim süresi 5 iş günüdür.</p>',
          order: 0,
        },
      ],
      variants: [
        {
          sku: 'KTR-S-BEJ',
          price: 899.99,
          stock: 999,
          attributes: { Beden: 'S', Renk: 'Bej' },
        },
        {
          sku: 'KTR-M-BEJ',
          price: 899.99,
          stock: 999,
          attributes: { Beden: 'M', Renk: 'Bej' },
        },
        {
          sku: 'KTR-S-SIY',
          price: 899.99,
          stock: 999,
          attributes: { Beden: 'S', Renk: 'Siyah' },
        },
      ],
    },
  ];

  for (const p of products) {
    const { details, variants, ...productData } = p;

    const product = await prisma.product.upsert({
      where: { slug_tenantId: { slug: p.slug, tenantId: tenant.id } },
      update: {},
      create: { ...productData, tenantId: tenant.id, isActive: true },
    });

    for (const v of variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { productId: product.id, ...v, isActive: true },
      });
    }

    for (const d of details) {
      const existing = await prisma.productDetail.findFirst({
        where: { productId: product.id, key: d.key, group: d.group },
      });
      if (!existing) {
        await prisma.productDetail.create({
          data: { productId: product.id, ...d },
        });
      }
    }

    console.log(`✓ ${p.name}`);
  }

  // Koleksiyonlar
  const yeniGelenler = await prisma.collection.upsert({
    where: { slug_tenantId: { slug: 'yeni-gelenler', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Yeni Gelenler',
      slug: 'yeni-gelenler',
      order: 1,
      tenantId: tenant.id,
    },
  });

  const yazKoleksiyonu = await prisma.collection.upsert({
    where: { slug_tenantId: { slug: 'yaz-koleksiyonu', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Yaz Koleksiyonu',
      slug: 'yaz-koleksiyonu',
      order: 2,
      tenantId: tenant.id,
    },
  });

  const ozelUretim = await prisma.collection.upsert({
    where: { slug_tenantId: { slug: 'ozel-uretim', tenantId: tenant.id } },
    update: {},
    create: {
      name: 'Özel Üretim',
      slug: 'ozel-uretim',
      order: 3,
      tenantId: tenant.id,
    },
  });

  const allProducts = await prisma.product.findMany({
    where: { tenantId: tenant.id },
  });

  for (const product of allProducts.slice(0, 4)) {
    await prisma.collectionProduct.upsert({
      where: {
        collectionId_productId: {
          collectionId: yeniGelenler.id,
          productId: product.id,
        },
      },
      update: {},
      create: { collectionId: yeniGelenler.id, productId: product.id },
    });
  }

  for (const product of allProducts.slice(0, 3)) {
    await prisma.collectionProduct.upsert({
      where: {
        collectionId_productId: {
          collectionId: yazKoleksiyonu.id,
          productId: product.id,
        },
      },
      update: {},
      create: { collectionId: yazKoleksiyonu.id, productId: product.id },
    });
  }

  const madeToOrderProducts = allProducts.filter(
    (p) => p.fulfillmentType === FulfillmentType.MADE_TO_ORDER,
  );
  for (const product of madeToOrderProducts) {
    await prisma.collectionProduct.upsert({
      where: {
        collectionId_productId: {
          collectionId: ozelUretim.id,
          productId: product.id,
        },
      },
      update: {},
      create: { collectionId: ozelUretim.id, productId: product.id },
    });
  }

  console.log('✓ Koleksiyonlar');
  console.log('✓ Seed tamamlandı!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
