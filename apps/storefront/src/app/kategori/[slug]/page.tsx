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
        <h1>Kategori bulunamadı</h1>
      </main>
    );
  }

  const products = (await getProducts(category.id)) as Product[];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Bu kategoride henüz ürün yok.</p>
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
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                  {mainImage ? (
                    <Image
                      src={mainImage.thumbUrl ?? mainImage.url}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Resim yok
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                {minPrice && (
                  <p className="text-gray-600 mt-1">{minPrice.toFixed(2)} ₺</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
