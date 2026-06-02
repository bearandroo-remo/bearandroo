const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(categoryId?: string) {
  const url = categoryId
    ? `${API_URL}/products?categoryId=${categoryId}`
    : `${API_URL}/products`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  return res.json();
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function getCategoryBySlug(slug: string) {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 60 },
  });
  const categories = await res.json();
  return categories.find((c: { slug: string }) => c.slug === slug) ?? null;
}

export async function getSeoByProduct(productId: string) {
  const res = await fetch(`${API_URL}/seo/product/${productId}`, {
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function getSeoByCategory(categoryId: string) {
  const res = await fetch(`${API_URL}/seo/category/${categoryId}`, {
    next: { revalidate: 60 },
  });
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}
