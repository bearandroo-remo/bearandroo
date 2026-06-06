'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Filters {
  attributes: Record<string, string[]>;
  price: { min: number; max: number };
}

interface Props {
  categoryId?: string;
  categoryIds?: string;
  brandId?: string;
  collectionId?: string;
}

export default function FilterPanel({
  categoryId,
  categoryIds,
  brandId,
  collectionId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  });
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    void loadFilters();
  }, [categoryId, brandId, collectionId]);

  const loadFilters = async () => {
    const params = new URLSearchParams();
    if (categoryIds) params.append('categoryIds', categoryIds);
    else if (categoryId) params.append('categoryId', categoryId);
    if (brandId) params.append('brandId', brandId);
    if (collectionId) params.append('collectionId', collectionId);

    const res = await fetch(
      `${API_URL}/products/filters?${params.toString()}`,
      {
        headers: { 'x-api-key': API_KEY ?? '' },
      },
    );
    if (res.ok) setFilters((await res.json()) as Filters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Attribute filtreleri
    Object.entries(selected).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    // Fiyat
    if (priceRange.min) params.set('minPrice', priceRange.min);
    else params.delete('minPrice');
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    else params.delete('maxPrice');

    // Stok
    if (inStock) params.set('inStock', 'true');
    else params.delete('inStock');

    // Sıralama
    if (sortBy) params.set('sortBy', sortBy);
    else params.delete('sortBy');

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelected({});
    setPriceRange({ min: '', max: '' });
    setInStock(false);
    setSortBy('');
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    router.push(params.toString() ? `?${params.toString()}` : '?');
  };

  if (!filters) return null;

  return (
    <div className="space-y-6">
      {/* Sıralama */}
      <div>
        <h3
          className="font-semibold mb-3 text-sm"
          style={{ color: 'var(--color-text)' }}
        >
          Sıralama
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
          style={{
            borderColor: 'var(--color-secondary)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
          }}
        >
          <option value="">Varsayılan</option>
          <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
          <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
          <option value="newest">En Yeni</option>
        </select>
      </div>

      {/* Stok */}
      <div>
        <label
          className="flex items-center gap-2 text-sm cursor-pointer"
          style={{ color: 'var(--color-text)' }}
        >
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          Sadece Stokta Olanlar
        </label>
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <h3
          className="font-semibold mb-3 text-sm"
          style={{ color: 'var(--color-text)' }}
        >
          Fiyat (₺)
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={`Min ${filters.price.min.toFixed(0)}`}
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
            style={{
              borderColor: 'var(--color-secondary)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
          <input
            type="number"
            placeholder={`Max ${filters.price.max.toFixed(0)}`}
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
            style={{
              borderColor: 'var(--color-secondary)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </div>

      {/* Attribute Filtreleri */}
      {Object.entries(filters.attributes).map(([key, values]) => (
        <div key={key}>
          <h3
            className="font-semibold mb-3 text-sm capitalize"
            style={{ color: 'var(--color-text)' }}
          >
            {key}
          </h3>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <button
                key={value}
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    [key]: prev[key] === value ? '' : value,
                  }))
                }
                className="px-3 py-1 rounded-lg text-sm transition"
                style={{
                  backgroundColor:
                    selected[key] === value
                      ? 'var(--color-primary)'
                      : 'var(--color-secondary)',
                  color:
                    selected[key] === value
                      ? 'var(--color-background)'
                      : 'var(--color-text)',
                  border: `1px solid ${selected[key] === value ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Butonlar */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 rounded-xl text-sm font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          Filtrele
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-xl text-sm transition hover:opacity-70"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text)',
          }}
        >
          Temizle
        </button>
      </div>
    </div>
  );
}
