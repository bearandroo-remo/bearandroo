export const runtime = 'edge';

import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts, getSeoByCategory } from '@/lib/api';
import type { Category, Product, ProductImage, Seo } from '@/lib/types';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = (await getCategories()) as Category[];
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Kategori bulunamadı' };

  const seo = (await getSeoByCategory(category.id)) as Seo | null;
  const title = seo?.metaTitle ?? category.name;
  const description = seo?.metaDescription ?? '';

  return {
    title,
    description,
    alternates: {
      canonical:
        seo?.canonicalUrl ?? `https://bearandroo.com.tr/kategori/${slug}`,
    },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle ?? title,
      description: seo?.twitterDescription ?? description,
      images: seo?.twitterImage ? [seo.twitterImage] : [],
    },
    robots: seo?.noIndex ? 'noindex' : 'index,follow',
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = (await getCategories()) as Category[];
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 style={{ color: 'var(--color-text)' }}>Kategori bulunamadı</h1>
      </main>
    );
  }

  const products = (await getProducts(category.id)) as Product[];

  // Alt kategoriler
  const subCategories = categories.filter((c) => c.parentId === category.id);

  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12"
      style={{ color: 'var(--color-text)' }}
    >
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        {category.name}
      </h1>

      {/* Alt Kategoriler */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {subCategories.map((sub: Category) => (
            <Link
              key={sub.id}
              href={`/kategori/${sub.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium transition hover:opacity-80"
              style={{
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
              }}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p style={{ color: 'var(--color-text)', opacity: 0.6 }}>
          Bu kategoride henüz ürün yok.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product: Product) => {
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
      )}
    </main>
  );
}
