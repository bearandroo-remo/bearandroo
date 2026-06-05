const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY ?? '',
};

export async function getProducts(categoryId?: string) {
  const url = categoryId
    ? `${API_URL}/products?categoryId=${categoryId}`
    : `${API_URL}/products`;
  const res = await fetch(url, { headers, next: { revalidate: 60 } });
  return res.json();
}

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