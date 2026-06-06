export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  children: Category[];
}

export interface ProductImage {
  id: string;
  url: string;
  thumbUrl: string | null;
  ogUrl: string | null;
  isMain: boolean;
  variantId: string | null;
}

export interface Variant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  category: Category | null;
  isActive: boolean;
  variants: Variant[];
  images: ProductImage[];
}

export interface Seo {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  schemaOrg: Record<string, unknown> | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  isActive: boolean;
  order: number;
  products: { product: Product }[];
  seo?: Seo | null;
}