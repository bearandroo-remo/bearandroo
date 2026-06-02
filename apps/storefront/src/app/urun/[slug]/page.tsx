export const runtime = 'edge';

import { getProductBySlug, getSeoByProduct } from '@/lib/api';
import type { Product, Seo } from '@/lib/types';
import type { Metadata } from 'next';
import ProductDetail from '@/components/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product;
  const seo = (await getSeoByProduct(product.id)) as Seo | null;

  const title = seo?.metaTitle ?? product.name;
  const description = seo?.metaDescription ?? product.description ?? '';
  const image =
    seo?.ogImage ??
    product.images.find((i) => i.isMain)?.ogUrl ??
    product.images[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: seo?.canonicalUrl ?? `https://bearandroo.com.tr/urun/${slug}`,
    },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      images: image ? [image] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle ?? title,
      description: seo?.twitterDescription ?? description,
      images: seo?.twitterImage ? [seo.twitterImage] : image ? [image] : [],
    },
    robots: seo?.noIndex ? 'noindex' : 'index,follow',
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product;
  const seo = (await getSeoByProduct(product.id)) as Seo | null;

  return (
    <>
      {seo?.schemaOrg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schemaOrg) }}
        />
      )}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <ProductDetail product={product} />
      </main>
    </>
  );
}
