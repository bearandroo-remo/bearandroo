'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBarInner() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    else setQuery('');
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ara?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md hidden md:flex">
      <div
        className="flex w-full rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--color-secondary)' }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün, kategori ara..."
          className="flex-1 px-4 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 transition hover:opacity-70"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 transition hover:opacity-80"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: 'var(--color-text)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 max-w-md hidden md:flex">
          <div
            className="flex w-full rounded-xl overflow-hidden border"
            style={{ borderColor: 'var(--color-secondary)' }}
          >
            <input
              placeholder="Ürün, kategori ara..."
              className="flex-1 px-4 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--color-background)' }}
            />
          </div>
        </div>
      }
    >
      <SearchBarInner />
    </Suspense>
  );
}
