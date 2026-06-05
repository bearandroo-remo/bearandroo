export const runtime = 'edge';

import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts } from '@/lib/api';
import type { Category, Product, ProductImage } from '@/lib/types';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories() as Promise<Category[]>,
    getProducts() as Promise<Product[]>,
  ]);

  const mainCategories = categories.filter((c) => !c.parentId);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Hero */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: 'var(--color-background)' }}
        >
          Bearandroo
        </h1>
        <p
          className="text-lg mb-8 opacity-80"
          style={{ color: 'var(--color-secondary)' }}
        >
          Kaliteli tekstil ürünleri
        </p>
        <Link
          href="/kategori"
          className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-primary)',
          }}
        >
          Alışverişe Başla
        </Link>
      </section>

      {/* Kategoriler */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          Kategoriler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="rounded-xl p-6 text-center font-medium transition hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-primary)',
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Yeni Ürünler */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          Yeni Ürünler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product: Product) => {
            const mainImage =
              product.images.find((i: ProductImage) => i.isMain) ??
              product.images[0];
            const minPrice =
              product.variants.length > 0
                ? Math.min(...product.variants.map((v) => parseFloat(v.price)))
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
                  <p className="mt-1" style={{ color: 'var(--color-primary)' }}>
                    {minPrice.toFixed(2)} ₺
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
