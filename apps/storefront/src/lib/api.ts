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
    next: { revalidate: 60 },
  });
  return res.json();
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

export async function getProducts(categoryId?: string, brandId?: string) {
  let url = `${API_URL}/products`;
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (brandId) params.append('brandId', brandId);
  if (params.toString()) url += `?${params.toString()}`;
  const res = await fetch(url, { headers, next: { revalidate: 60 } });
  return res.json();
}