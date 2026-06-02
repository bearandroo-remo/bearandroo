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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Bearandroo</h1>
        <p className="text-gray-300 text-lg mb-8">Kaliteli tekstil ürünleri</p>
        <Link
          href="/kategori"
          className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Alışverişe Başla
        </Link>
      </section>

      {/* Kategoriler */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="bg-gray-100 rounded-xl p-6 text-center hover:bg-gray-200 transition font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Yeni Ürünler */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-8">Yeni Ürünler</h2>
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
      </section>
    </main>
  );
}
