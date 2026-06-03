import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding...');

  // Kategoriler
  const kadin = await prisma.category.upsert({
    where: { slug: 'kadin' },
    update: {},
    create: { name: 'Kadın', slug: 'kadin', order: 1 },
  });

  const erkek = await prisma.category.upsert({
    where: { slug: 'erkek' },
    update: {},
    create: { name: 'Erkek', slug: 'erkek', order: 2 },
  });

  const kadinUstGiyim = await prisma.category.upsert({
    where: { slug: 'kadin-ust-giyim' },
    update: {},
    create: {
      name: 'Üst Giyim',
      slug: 'kadin-ust-giyim',
      parentId: kadin.id,
      order: 1,
    },
  });

  const kadinAltGiyim = await prisma.category.upsert({
    where: { slug: 'kadin-alt-giyim' },
    update: {},
    create: {
      name: 'Alt Giyim',
      slug: 'kadin-alt-giyim',
      parentId: kadin.id,
      order: 2,
    },
  });

  const erkekUstGiyim = await prisma.category.upsert({
    where: { slug: 'erkek-ust-giyim' },
    update: {},
    create: {
      name: 'Üst Giyim',
      slug: 'erkek-ust-giyim',
      parentId: erkek.id,
      order: 1,
    },
  });

  // Ürünler
  const products = [
    {
      name: 'Basic T-Shirt',
      slug: 'basic-t-shirt',
      description: 'Günlük kullanım için ideal pamuklu t-shirt.',
      categoryId: kadinUstGiyim.id,
      variants: [
        {
          sku: 'BTS-W-XS',
          price: 199.99,
          stock: 20,
          attributes: { Beden: 'XS', Renk: 'Beyaz' },
        },
        {
          sku: 'BTS-W-S',
          price: 199.99,
          stock: 15,
          attributes: { Beden: 'S', Renk: 'Beyaz' },
        },
        {
          sku: 'BTS-W-M',
          price: 199.99,
          stock: 10,
          attributes: { Beden: 'M', Renk: 'Beyaz' },
        },
        {
          sku: 'BTS-B-S',
          price: 199.99,
          stock: 8,
          attributes: { Beden: 'S', Renk: 'Siyah' },
        },
        {
          sku: 'BTS-B-M',
          price: 199.99,
          stock: 5,
          attributes: { Beden: 'M', Renk: 'Siyah' },
        },
      ],
    },
    {
      name: 'Slim Fit Jean',
      slug: 'slim-fit-jean',
      description: 'Modern kesim yüksek kaliteli kot pantolon.',
      categoryId: kadinAltGiyim.id,
      variants: [
        {
          sku: 'SFJ-28',
          price: 499.99,
          stock: 12,
          attributes: { Beden: '28', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-30',
          price: 499.99,
          stock: 8,
          attributes: { Beden: '30', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-32',
          price: 499.99,
          stock: 6,
          attributes: { Beden: '32', Renk: 'Mavi' },
        },
        {
          sku: 'SFJ-30-S',
          price: 499.99,
          stock: 0,
          attributes: { Beden: '30', Renk: 'Siyah' },
        },
      ],
    },
    {
      name: 'Oversize Sweatshirt',
      slug: 'oversize-sweatshirt',
      description: 'Rahat ve şık oversize sweatshirt.',
      categoryId: kadinUstGiyim.id,
      variants: [
        {
          sku: 'OSS-G-S',
          price: 349.99,
          stock: 10,
          attributes: { Beden: 'S', Renk: 'Gri' },
        },
        {
          sku: 'OSS-G-M',
          price: 349.99,
          stock: 8,
          attributes: { Beden: 'M', Renk: 'Gri' },
        },
        {
          sku: 'OSS-B-M',
          price: 349.99,
          stock: 5,
          attributes: { Beden: 'M', Renk: 'Bej' },
        },
      ],
    },
    {
      name: 'Erkek Basic Tişört',
      slug: 'erkek-basic-tisort',
      description: 'Erkekler için klasik kesim pamuklu tişört.',
      categoryId: erkekUstGiyim.id,
      variants: [
        {
          sku: 'EBT-W-S',
          price: 179.99,
          stock: 20,
          attributes: { Beden: 'S', Renk: 'Beyaz' },
        },
        {
          sku: 'EBT-W-M',
          price: 179.99,
          stock: 15,
          attributes: { Beden: 'M', Renk: 'Beyaz' },
        },
        {
          sku: 'EBT-W-L',
          price: 179.99,
          stock: 10,
          attributes: { Beden: 'L', Renk: 'Beyaz' },
        },
        {
          sku: 'EBT-B-M',
          price: 179.99,
          stock: 8,
          attributes: { Beden: 'M', Renk: 'Siyah' },
        },
        {
          sku: 'EBT-B-L',
          price: 179.99,
          stock: 6,
          attributes: { Beden: 'L', Renk: 'Siyah' },
        },
        {
          sku: 'EBT-B-XL',
          price: 179.99,
          stock: 4,
          attributes: { Beden: 'XL', Renk: 'Siyah' },
        },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        isActive: true,
      },
    });

    for (const v of p.variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          productId: product.id,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          attributes: v.attributes,
          isActive: true,
        },
      });
    }

    console.log(`✓ ${p.name}`);
  }

  // Koleksiyonlar
  const yeniGelenler = await prisma.collection.upsert({
    where: { slug: 'yeni-gelenler' },
    update: {},
    create: { name: 'Yeni Gelenler', slug: 'yeni-gelenler', order: 1 },
  });

  const yazKoleksiyonu = await prisma.collection.upsert({
    where: { slug: 'yaz-koleksiyonu' },
    update: {},
    create: { name: 'Yaz Koleksiyonu', slug: 'yaz-koleksiyonu', order: 2 },
  });

  // Koleksiyona ürün ekle
  const allProducts = await prisma.product.findMany({ take: 4 });
  for (const product of allProducts) {
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

  for (const product of allProducts.slice(0, 2)) {
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

  console.log('✓ Seed tamamlandı!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
