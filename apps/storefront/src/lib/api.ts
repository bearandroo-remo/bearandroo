const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY ?? '',
};

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    headers,
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    headers,
    cache: 'no-store',
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getSeoByProduct(productId: string) {
  const res = await fetch(`${API_URL}/seo/product/${productId}`, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getSeoByCategory(categoryId: string) {
  const res = await fetch(`${API_URL}/seo/category/${categoryId}`, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getTenantSettings() {
  const res = await fetch(`${API_URL}/tenant-settings`, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getCollectionBySlug(slug: string) {
  const res = await fetch(`${API_URL}/collections/${slug}`, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getBrandBySlug(slug: string) {
  const res = await fetch(`${API_URL}/brands/${slug}`, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);

}

export async function getProducts(
  categoryId?: string,
  brandId?: string,
  collectionId?: string,
  search?: string,
  attributes?: Record<string, string>,
  minPrice?: number,
  maxPrice?: number,
  inStock?: boolean,
  fulfillmentType?: string,
  sortBy?: string,
  categoryIds?: string,
) {
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (categoryIds) params.append('categoryIds', categoryIds);
  if (brandId) params.append('brandId', brandId);
  if (collectionId) params.append('collectionId', collectionId);
  if (search) params.append('q', search);
  if (minPrice) params.append('minPrice', String(minPrice));
  if (maxPrice) params.append('maxPrice', String(maxPrice));
  if (inStock) params.append('inStock', 'true');
  if (fulfillmentType) params.append('fulfillmentType', fulfillmentType);
  if (sortBy) params.append('sortBy', sortBy);
  if (attributes) {
    Object.entries(attributes).forEach(([k, v]) => params.append(k, v));
  }

  const url = params.toString()
    ? `${API_URL}/products?${params.toString()}`
    : `${API_URL}/products`;

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  });
  return res.json();
}