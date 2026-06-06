export const runtime = 'edge';

import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/api';
import type { Product, ProductImage } from '@/lib/types';
import FilterPanel from '@/components/FilterPanel';

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { q, minPrice, maxPrice, inStock, sortBy, ...attributeParams } = sp;

  const reservedKeys = ['q', 'minPrice', 'maxPrice', 'inStock', 'sortBy'];
  const attributes: Record<string, string> = {};
  Object.entries(attributeParams).forEach(([k, v]) => {
    if (!reservedKeys.includes(k)) attributes[k] = v;
  });

  const products = q
    ? ((await getProducts(
        undefined,
        undefined,
        undefined,
        q,
        Object.keys(attributes).length > 0 ? attributes : undefined,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined,
        inStock === 'true',
        undefined,
        sortBy,
      )) as Product[])
    : [];

  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ color: 'var(--color-text)' }}
    >
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {q ? `"${q}" için sonuçlar` : 'Arama'}
      </h1>
      <p
        className="text-sm opacity-60 mb-8"
        style={{ color: 'var(--color-text)' }}
      >
        {products.length} ürün bulundu
      </p>

      {!q ? (
        <div className="text-center py-16">
          <p
            className="text-lg opacity-60 mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Aramak istediğiniz ürünü girin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sol Filtre Panel */}
          <aside
            className="rounded-xl p-4 h-fit"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <FilterPanel />
          </aside>

          {/* Ürün Grid */}
          <div className="md:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p
                  className="text-lg opacity-60 mb-4"
                  style={{ color: 'var(--color-text)' }}
                >
                  Ürün bulunamadı.
                </p>
                <Link
                  href="/"
                  className="text-sm font-medium transition hover:opacity-70"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
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
      )}
    </main>
  );
}
