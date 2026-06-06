/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CategoryRow {
  name: string;
  parentName?: string;
  slug?: string;
  order?: number;
  icon?: string;
}

interface BrandRow {
  name: string;
  slug?: string;
  logo?: string;
}

interface CollectionRow {
  name: string;
  slug?: string;
  description?: string;
  order?: number;
}

interface ProductRow {
  name: string;
  slug?: string;
  description?: string;
  categoryName?: string;
  brandName?: string;
  collectionName?: string;
  price: number | string;
  stock: number | string;
  sku?: string;
  fulfillmentType?: string;
  productionDays?: number | string;
  isActive?: string | boolean;
  metaTitle?: string;
  metaDescription?: string;
  [key: string]: unknown;
}

interface ValidationError {
  sheet: string;
  row: number;
  field: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  summary: {
    categories: number;
    brands: number;
    collections: number;
    products: number;
    variants: number;
    newCategories: string[];
    newBrands: string[];
    newCollections: string[];
    slugConflicts: string[];
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class ProductImportService {
  constructor(private prisma: PrismaService) {}

  // ── Template ──────────────────────────────────────────────────────────────

  generateTemplate(): Buffer {
    const wb = XLSX.utils.book_new();

    // Sheet 1 - Kategoriler
    const categoryData = [
      { name: 'Kadın', parentName: '', slug: 'kadin', order: 1, icon: '👗' },
      {
        name: 'Üst Giyim',
        parentName: 'Kadın',
        slug: 'kadin-ust-giyim',
        order: 1,
        icon: '',
      },
      {
        name: 'Alt Giyim',
        parentName: 'Kadın',
        slug: 'kadin-alt-giyim',
        order: 2,
        icon: '',
      },
      { name: 'Erkek', parentName: '', slug: 'erkek', order: 2, icon: '👕' },
    ];
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(categoryData),
      'Kategoriler',
    );

    // Sheet 2 - Markalar
    const brandData = [
      { name: 'Bearandroo', slug: 'bearandroo', logo: '' },
      { name: 'Basic Wear', slug: 'basic-wear', logo: '' },
    ];
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(brandData),
      'Markalar',
    );

    // Sheet 3 - Koleksiyonlar
    const collectionData = [
      {
        name: 'Yaz Koleksiyonu',
        slug: 'yaz-koleksiyonu',
        description: 'Yaz ürünleri',
        order: 1,
      },
      {
        name: 'Yeni Gelenler',
        slug: 'yeni-gelenler',
        description: '',
        order: 2,
      },
    ];
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(collectionData),
      'Koleksiyonlar',
    );

    // Sheet 4 - Ürünler
    const productData = [
      {
        name: 'Basic T-Shirt',
        slug: 'basic-t-shirt',
        description: 'Günlük kullanım için ideal t-shirt',
        categoryName: 'Üst Giyim',
        brandName: 'Bearandroo',
        collectionName: 'Yeni Gelenler',
        price: 199.99,
        stock: 10,
        sku: 'BTS-S-W',
        fulfillmentType: 'READY',
        productionDays: '',
        isActive: true,
        metaTitle: '',
        metaDescription: '',
        Beden: 'S',
        Renk: 'Beyaz',
      },
      {
        name: 'Basic T-Shirt',
        slug: 'basic-t-shirt',
        description: 'Günlük kullanım için ideal t-shirt',
        categoryName: 'Üst Giyim',
        brandName: 'Bearandroo',
        collectionName: 'Yeni Gelenler',
        price: 199.99,
        stock: 8,
        sku: 'BTS-M-W',
        fulfillmentType: 'READY',
        productionDays: '',
        isActive: true,
        metaTitle: '',
        metaDescription: '',
        Beden: 'M',
        Renk: 'Beyaz',
      },
    ];
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(productData),
      'Ürünler',
    );

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer as Buffer;
  }

  // ── Parse ─────────────────────────────────────────────────────────────────

  private parseSheets(buffer: Buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer' });

    const categorySheet = wb.Sheets['Kategoriler'];
    const brandSheet = wb.Sheets['Markalar'];
    const collectionSheet = wb.Sheets['Koleksiyonlar'];
    const productSheet = wb.Sheets['Ürünler'];

    return {
      categories: categorySheet
        ? XLSX.utils.sheet_to_json<CategoryRow>(categorySheet)
        : [],
      brands: brandSheet ? XLSX.utils.sheet_to_json<BrandRow>(brandSheet) : [],
      collections: collectionSheet
        ? XLSX.utils.sheet_to_json<CollectionRow>(collectionSheet)
        : [],
      products: productSheet
        ? XLSX.utils.sheet_to_json<ProductRow>(productSheet)
        : [],
    };
  }

  // ── Validate ──────────────────────────────────────────────────────────────

  async validate(buffer: Buffer, tenantId: string): Promise<ValidationResult> {
    const { categories, brands, collections, products } =
      this.parseSheets(buffer);
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Mevcut veriyi çek
    const existingCategories = await this.prisma.category.findMany({
      where: { tenantId },
    });
    const existingBrands = await this.prisma.brand.findMany({
      where: { tenantId },
    });
    const existingCollections = await this.prisma.collection.findMany({
      where: { tenantId },
    });
    const existingProducts = await this.prisma.product.findMany({
      where: { tenantId },
    });

    const existingCategoryNames = new Set(
      existingCategories.map((c) => c.name.toLowerCase()),
    );
    const existingBrandNames = new Set(
      existingBrands.map((b) => b.name.toLowerCase()),
    );
    const existingCollectionNames = new Set(
      existingCollections.map((c) => c.name.toLowerCase()),
    );
    const existingProductSlugs = new Set(existingProducts.map((p) => p.slug));

    const newCategories: string[] = [];
    const newBrands: string[] = [];
    const newCollections: string[] = [];
    const slugConflicts: string[] = [];

    // Excel'deki tüm isimler
    const excelCategoryNames = new Set(
      categories.map((c) => c.name.toLowerCase()),
    );
    const excelBrandNames = new Set(brands.map((b) => b.name.toLowerCase()));
    const excelCollectionNames = new Set(
      collections.map((c) => c.name.toLowerCase()),
    );

    // Kategori validasyonu
    for (let i = 0; i < categories.length; i++) {
      const row = categories[i];
      const rowNum = i + 2;

      if (!row.name) {
        errors.push({
          sheet: 'Kategoriler',
          row: rowNum,
          field: 'name',
          message: 'Kategori adı zorunlu',
        });
      }

      if (
        row.parentName &&
        !excelCategoryNames.has(String(row.parentName).toLowerCase()) &&
        !existingCategoryNames.has(String(row.parentName).toLowerCase())
      ) {
        errors.push({
          sheet: 'Kategoriler',
          row: rowNum,
          field: 'parentName',
          message: `Üst kategori bulunamadı: ${row.parentName}`,
        });
      }

      if (row.name && !existingCategoryNames.has(row.name.toLowerCase())) {
        newCategories.push(row.name);
      }
    }

    // Marka validasyonu
    for (let i = 0; i < brands.length; i++) {
      const row = brands[i];
      const rowNum = i + 2;

      if (!row.name) {
        errors.push({
          sheet: 'Markalar',
          row: rowNum,
          field: 'name',
          message: 'Marka adı zorunlu',
        });
      }

      if (row.name && !existingBrandNames.has(row.name.toLowerCase())) {
        newBrands.push(row.name);
      }
    }

    // Koleksiyon validasyonu
    for (let i = 0; i < collections.length; i++) {
      const row = collections[i];
      const rowNum = i + 2;

      if (!row.name) {
        errors.push({
          sheet: 'Koleksiyonlar',
          row: rowNum,
          field: 'name',
          message: 'Koleksiyon adı zorunlu',
        });
      }

      if (row.name && !existingCollectionNames.has(row.name.toLowerCase())) {
        newCollections.push(row.name);
      }
    }

    // Ürün validasyonu
    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      const rowNum = i + 2;

      if (!row.name) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'name',
          message: 'Ürün adı zorunlu',
        });
      }

      if (!row.price && row.price !== 0) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'price',
          message: 'Fiyat zorunlu',
        });
      } else if (isNaN(Number(row.price))) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'price',
          message: 'Fiyat sayı olmalı',
        });
      }

      if (!row.stock && row.stock !== 0) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'stock',
          message: 'Stok zorunlu',
        });
      } else if (isNaN(Number(row.stock))) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'stock',
          message: 'Stok sayı olmalı',
        });
      }

      if (
        row.categoryName &&
        !excelCategoryNames.has(String(row.categoryName).toLowerCase()) &&
        !existingCategoryNames.has(String(row.categoryName).toLowerCase())
      ) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'categoryName',
          message: `Kategori bulunamadı: ${row.categoryName}`,
        });
      }

      if (
        row.brandName &&
        !excelBrandNames.has(String(row.brandName).toLowerCase()) &&
        !existingBrandNames.has(String(row.brandName).toLowerCase())
      ) {
        errors.push({
          sheet: 'Ürünler',
          row: rowNum,
          field: 'brandName',
          message: `Marka bulunamadı: ${row.brandName}`,
        });
      }

      if (
        row.collectionName &&
        !excelCollectionNames.has(String(row.collectionName).toLowerCase()) &&
        !existingCollectionNames.has(String(row.collectionName).toLowerCase())
      ) {
        warnings.push(
          `Satır ${rowNum}: Koleksiyon bulunamadı: ${row.collectionName} - atlanacak`,
        );
      }

      const slug = row.slug ?? this.toSlug(String(row.name ?? ''));
      if (existingProductSlugs.has(slug)) {
        if (!slugConflicts.includes(slug)) slugConflicts.push(slug);
        warnings.push(
          `Satır ${rowNum}: "${slug}" slug'ı zaten var, variant eklenecek`,
        );
      }
    }

    const uniqueProducts = new Set(
      products.map((r) => r.slug ?? this.toSlug(String(r.name ?? ''))),
    );

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        categories: categories.length,
        brands: brands.length,
        collections: collections.length,
        products: uniqueProducts.size,
        variants: products.length,
        newCategories,
        newBrands,
        newCollections,
        slugConflicts,
      },
    };
  }

  // ── Import ────────────────────────────────────────────────────────────────

  async import(
    buffer: Buffer,
    tenantId: string,
  ): Promise<{ imported: number; errors: string[] }> {
    const validation = await this.validate(buffer, tenantId);
    if (!validation.valid) {
      return {
        imported: 0,
        errors: validation.errors.map(
          (e) => `[${e.sheet}] Satır ${e.row} - ${e.field}: ${e.message}`,
        ),
      };
    }

    const { categories, brands, collections, products } =
      this.parseSheets(buffer);
    const errors: string[] = [];
    let imported = 0;

    // Cache
    const categoryCache = new Map<string, string>();
    const brandCache = new Map<string, string>();
    const collectionCache = new Map<string, string>();

    // Mevcut veriyi cache'e al
    const existingCategories = await this.prisma.category.findMany({
      where: { tenantId },
    });
    existingCategories.forEach((c) =>
      categoryCache.set(c.name.toLowerCase(), c.id),
    );

    const existingBrands = await this.prisma.brand.findMany({
      where: { tenantId },
    });
    existingBrands.forEach((b) => brandCache.set(b.name.toLowerCase(), b.id));

    const existingCollections = await this.prisma.collection.findMany({
      where: { tenantId },
    });
    existingCollections.forEach((c) =>
      collectionCache.set(c.name.toLowerCase(), c.id),
    );

    // 1. Kategorileri import et
    for (const row of categories) {
      if (!row.name) continue;
      const key = row.name.toLowerCase();
      if (!categoryCache.has(key)) {
        try {
          let parentId: string | undefined;
          if (row.parentName) {
            parentId = categoryCache.get(String(row.parentName).toLowerCase());
          }
          const cat = await this.prisma.category.create({
            data: {
              name: row.name,
              slug: row.slug ?? this.toSlug(row.name),
              parentId,
              order: row.order ? Number(row.order) : 0,
              icon: row.icon ? String(row.icon) : undefined,
              tenantId,
            },
          });
          categoryCache.set(key, cat.id);
        } catch (err) {
          errors.push(`Kategori "${row.name}": ${String(err)}`);
        }
      }
    }

    // 2. Markaları import et
    for (const row of brands) {
      if (!row.name) continue;
      const key = row.name.toLowerCase();
      if (!brandCache.has(key)) {
        try {
          const brand = await this.prisma.brand.create({
            data: {
              name: row.name,
              slug: row.slug ?? this.toSlug(row.name),
              logo: row.logo ? String(row.logo) : undefined,
              tenantId,
            },
          });
          brandCache.set(key, brand.id);
        } catch (err) {
          errors.push(`Marka "${row.name}": ${String(err)}`);
        }
      }
    }

    // 3. Koleksiyonları import et
    for (const row of collections) {
      if (!row.name) continue;
      const key = row.name.toLowerCase();
      if (!collectionCache.has(key)) {
        try {
          const col = await this.prisma.collection.create({
            data: {
              name: row.name,
              slug: row.slug ?? this.toSlug(row.name),
              description: row.description
                ? String(row.description)
                : undefined,
              order: row.order ? Number(row.order) : 0,
              tenantId,
            },
          });
          collectionCache.set(key, col.id);
        } catch (err) {
          errors.push(`Koleksiyon "${row.name}": ${String(err)}`);
        }
      }
    }

    // 4. Ürünleri import et
    const productGroups = new Map<string, ProductRow[]>();
    for (const row of products) {
      const slug = row.slug ?? this.toSlug(String(row.name ?? ''));
      if (!productGroups.has(slug)) productGroups.set(slug, []);
      productGroups.get(slug)!.push(row);
    }

    for (const [slug, productRows] of productGroups) {
      try {
        const firstRow = productRows[0];

        const categoryId = firstRow.categoryName
          ? categoryCache.get(String(firstRow.categoryName).toLowerCase())
          : undefined;

        const brandId = firstRow.brandName
          ? brandCache.get(String(firstRow.brandName).toLowerCase())
          : undefined;

        // Ürün bul veya oluştur
        let product = await this.prisma.product.findUnique({
          where: { slug_tenantId: { slug, tenantId } },
        });

        if (!product) {
          product = await this.prisma.product.create({
            data: {
              name: String(firstRow.name),
              slug,
              description: firstRow.description
                ? String(firstRow.description)
                : undefined,
              categoryId,
              brandId,
              tenantId,
              fulfillmentType: (firstRow.fulfillmentType as any) ?? 'READY',
              productionDays: firstRow.productionDays
                ? Number(firstRow.productionDays)
                : undefined,
              isActive:
                firstRow.isActive !== 'false' && firstRow.isActive !== false,
            },
          });
        } else {
          // Mevcut ürünü güncelle
          product = await this.prisma.product.update({
            where: { id: product.id },
            data: {
              name: String(firstRow.name),
              description: firstRow.description
                ? String(firstRow.description)
                : undefined,
              categoryId,
              brandId,
              fulfillmentType: (firstRow.fulfillmentType as any) ?? 'READY',
              productionDays: firstRow.productionDays
                ? Number(firstRow.productionDays)
                : undefined,
            },
          });
        }

        // Koleksiyona ekle
        if (firstRow.collectionName) {
          const collectionId = collectionCache.get(
            String(firstRow.collectionName).toLowerCase(),
          );
          if (collectionId) {
            const existing = await this.prisma.collectionProduct.findUnique({
              where: {
                collectionId_productId: { collectionId, productId: product.id },
              },
            });
            if (!existing) {
              await this.prisma.collectionProduct.create({
                data: { collectionId, productId: product.id },
              });
            }
          }
        }

        // Variantları oluştur
        const reservedKeys = [
          'name',
          'slug',
          'description',
          'categoryName',
          'brandName',
          'collectionName',
          'price',
          'stock',
          'sku',
          'fulfillmentType',
          'productionDays',
          'isActive',
          'metaTitle',
          'metaDescription',
        ];

        for (const row of productRows) {
          const attributes: Record<string, string> = {};
          for (const [key, value] of Object.entries(row)) {
            if (
              !reservedKeys.includes(key) &&
              value !== undefined &&
              value !== ''
            ) {
              attributes[key] = String(value);
            }
          }

          const sku = row.sku
            ? String(row.sku)
            : `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

          const existingVariant = await this.prisma.variant.findUnique({
            where: { sku },
          });
          if (!existingVariant) {
            await this.prisma.variant.create({
              data: {
                productId: product.id,
                sku,
                price: Number(row.price),
                stock: Number(row.stock),
                attributes,
                isActive: true,
              },
            });
          }
        }

        // SEO
        if (firstRow.metaTitle || firstRow.metaDescription) {
          await this.prisma.seo.upsert({
            where: { productId: product.id },
            create: {
              productId: product.id,
              metaTitle: firstRow.metaTitle
                ? String(firstRow.metaTitle)
                : undefined,
              metaDescription: firstRow.metaDescription
                ? String(firstRow.metaDescription)
                : undefined,
            },
            update: {
              metaTitle: firstRow.metaTitle
                ? String(firstRow.metaTitle)
                : undefined,
              metaDescription: firstRow.metaDescription
                ? String(firstRow.metaDescription)
                : undefined,
            },
          });
        }

        imported++;
      } catch (err) {
        errors.push(`Ürün "${slug}": ${String(err)}`);
      }
    }

    return { imported, errors };
  }

  // ── Helper ────────────────────────────────────────────────────────────────

  toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
