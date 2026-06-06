export const runtime = 'edge';

import Link from 'next/link';
import Image from 'next/image';
import { getBrandBySlug, getProducts } from '@/lib/api';
import type { Product, ProductImage } from '@/lib/types';
import type { Metadata } from 'next';
import FilterPanel from '@/components/FilterPanel';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: 'Marka bulunamadı' };

  return {
    title: brand.name,
    description: `${brand.name} markalı ürünler`,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 style={{ color: 'var(--color-text)' }}>Marka bulunamadı</h1>
      </main>
    );
  }

  const { minPrice, maxPrice, inStock, sortBy, ...attributeParams } = sp;
  const reservedKeys = ['minPrice', 'maxPrice', 'inStock', 'sortBy', 'slug'];
  const attributes: Record<string, string> = {};
  Object.entries(attributeParams).forEach(([k, v]) => {
    if (!reservedKeys.includes(k)) attributes[k] = v;
  });

  const products = (await getProducts(
    undefined,
    brand.id,
    undefined,
    undefined,
    Object.keys(attributes).length > 0 ? attributes : undefined,
    minPrice ? parseFloat(minPrice) : undefined,
    maxPrice ? parseFloat(maxPrice) : undefined,
    inStock === 'true',
    undefined,
    sortBy,
  )) as Product[];

  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ color: 'var(--color-text)' }}
    >
      {/* Marka Başlığı */}
      <div className="flex items-center gap-4 mb-8">
        {brand.logo && (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={80}
            height={80}
            className="rounded-xl object-contain"
          />
        )}
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {brand.name}
          </h1>
          <p className="opacity-60 mt-1">{products.length} ürün</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sol Filtre Panel */}
        <aside
          className="rounded-xl p-4 h-fit"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <FilterPanel brandId={brand.id} />
        </aside>

        {/* Ürün Grid */}
        <div className="md:col-span-3">
          <p
            className="text-sm opacity-60 mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {products.length} ürün
          </p>

          {products.length === 0 ? (
            <p className="opacity-60">Bu markaya ait henüz ürün yok.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product: Product) => {
                const mainImage =
                  product.images.find((i: ProductImage) => i.isMain) ??
                  product.images[0];
                const minPrice =
                  product.variants.length > 0
                    ? Math.min(
                        ...product.variants.map((v) => parseFloat(v.price)),
                      )
                    : null;

                return (
                  <Link
                    key={product.id}
                    href={`/urun/${product.slug}`}
                    className="group"
                  >
                    <div
                      className="aspect-square rounded-xl overflow-hidden mb-3"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                      {mainImage ? (
                        <Image
                          src={mainImage.thumbUrl ?? mainImage.url}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          Resim yok
                        </div>
                      )}
                    </div>
                    <h3
                      className="font-medium"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {product.name}
                    </h3>
                    {minPrice && (
                      <p
                        className="mt-1"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {minPrice.toFixed(2)} ₺
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
